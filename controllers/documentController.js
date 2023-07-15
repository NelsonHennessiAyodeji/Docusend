const {
  Office,
  Interaction,
  PersonalInteraction
} = require("../models/Office");
const DocInfo = require("../models/DocInfo");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { upload } = require("../utilities");

const sendMessage = async (req, res) => {
  const { id: receivingOfficeId } = req.params;
  const { officeId: sendingOfficeId } = req.office;
  const { downloadLink: documentDownloadLink } = req.body;
  const sendingOffice = await Office.findOne({ _id: sendingOfficeId });
  const receivingOffice = await Office.findOne({ _id: receivingOfficeId });
  let updateTrigger = Math.random() * 100;

  // upload();

  if (receivingOfficeId === sendingOfficeId) {
    throw new BadRequestError(
      "The sending office and receiving office are thesame"
    );
  }

  if (!receivingOffice || !sendingOffice) {
    throw new BadRequestError("Please provide a reciever as well as a sender");
  }

  let storedInteraction;

  let hasInteracted = await Interaction.findOne({
    office1: sendingOfficeId,
    office2: receivingOfficeId
  });
  let hasInteractedInverse = await Interaction.findOne({
    office1: receivingOfficeId,
    office2: sendingOfficeId
  });
  let isInteracted = hasInteracted || hasInteractedInverse;

  if (!isInteracted) {
    const interaction = await Interaction.create({
      office1: sendingOfficeId,
      office2: receivingOfficeId
    });
    await PersonalInteraction.create({
      thisOffice: sendingOfficeId,
      to: receivingOfficeId,
      interaction,
      trigger: updateTrigger
    });
    await PersonalInteraction.create({
      thisOffice: receivingOfficeId,
      to: sendingOfficeId,
      interaction,
      trigger: updateTrigger
    });
    //TODO: To make this code beter, try getting this from the personalINteration elements on the office
    if (!interaction) {
      //TODO: the error code
      throw new BadRequestError("Something happened, please try again later");
    }
    sendingOffice.interactions.push(interaction._id);
    receivingOffice.interactions.push(interaction._id);
    storedInteraction = interaction._id;
  } else {
    if (hasInteracted !== null) {
      storedInteraction = hasInteracted._id;
    } else {
      storedInteraction = hasInteractedInverse._id;
    }
    const sender = await PersonalInteraction.findOne({
      thisOffice: sendingOfficeId,
      to: receivingOfficeId
    });
    sender.trigger = updateTrigger;
    const reciever = await PersonalInteraction.findOne({
      thisOffice: receivingOfficeId,
      to: sendingOfficeId
    });
    reciever.trigger = updateTrigger;
    await sender.save();
    await reciever.save();
  }

  const docInfo = await DocInfo.create({
    from: sendingOfficeId,
    to: receivingOfficeId,
    downloadLink: documentDownloadLink,
    interaction: storedInteraction
  });

  res.status(StatusCodes.CREATED).json(docInfo);
};

const getAllMessage = async (req, res) => {
  const { officeId: sendingOfficeId } = req.office;
  const { id: receivingOfficeId } = req.params;
  let interaction = await Interaction.findOne({
    office1: sendingOfficeId,
    office2: receivingOfficeId
  });
  if (!interaction) {
    const interactionInverse = await Interaction.findOne({
      office1: receivingOfficeId,
      office2: sendingOfficeId
    });
    if (!interactionInverse) {
      return res
        .status(StatusCodes.OK)
        .json("No documents have been sent from and to this office");
    }
    interaction = interactionInverse;
  }
  const documents = await DocInfo.find({ interaction: interaction._id })
    .select("-interaction -createdAt -updatedAt")
    .populate("from")
    .populate("to")
    .sort({
      updatedAt: 1
    });
  res.status(StatusCodes.OK).json(documents);
};

const getAllInteractions = async (req, res) => {
  const personalInteractions = await PersonalInteraction.find({
    thisOffice: req.office.officeId
  })
    .select("-thisOffice -interaction -createdAt ")
    .populate("to")
    .sort({ updatedAt: -1 });
  res.status(StatusCodes.OK).json(personalInteractions);
};

// .populate('user', 'name email')
//     .populate({
//         path: 'orderItems',
//         populate: {
//             path: 'product',
//             populate: 'category'
//         }
//     })
//     .sort({'dateOrdered': -1});

module.exports = {
  sendMessage,
  getAllMessage,
  getAllInteractions
};
