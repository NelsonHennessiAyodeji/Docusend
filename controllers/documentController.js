const {
  Office,
  Interaction,
  PersonalInteraction,
} = require("../models/Office");
const DocInfo = require("../models/DocInfo");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const sendMessage = async (req, res) => {
  const { id: receiverOfficeId } = req.params;
  const { officeId: senderOfficeId } = req.office;
  const { downloadLink: documentDownloadLink } = req.body;
  const sendingOffice = await Office.findOne({ _id: senderOfficeId });
  const receivingOffice = await Office.findOne({ _id: receiverOfficeId });

  if (receiverOfficeId === senderOfficeId) {
    throw new BadRequestError(
      "The sending office and receiving office are thesame"
    );
  }

  if (!receivingOffice || !sendingOffice) {
    throw new BadRequestError("Please provide a reciever as well as a sender");
  }

  let storedInteraction;

  const hasInteracted = await Interaction.findOne({
    office1: senderOfficeId,
    office2: receiverOfficeId,
  });
  const hasInteractedInverse = await Interaction.findOne({
    office1: receiverOfficeId,
    office2: senderOfficeId,
  });
  const isInteracted = hasInteracted || hasInteractedInverse;

  if (!isInteracted) {
    const interaction = await Interaction.create({
      office1: senderOfficeId,
      office2: receiverOfficeId,
    });
    await PersonalInteraction.create({
      thisOffice: senderOfficeId,
      to: receiverOfficeId,
      interaction,
    });
    await PersonalInteraction.create({
      thisOffice: receiverOfficeId,
      to: senderOfficeId,
      interaction,
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
  }

  const docInfo = await DocInfo.create({
    from: senderOfficeId,
    to: receiverOfficeId,
    downloadLink: documentDownloadLink,
    interaction: storedInteraction,
  });

  res.status(StatusCodes.CREATED).json(docInfo);
};

const getAllMessage = async (req, res) => {
  const { officeId: sendingOfficeId } = req.office;
  const { id: receivingOfficeId } = req.params;
  let interaction = await Interaction.findOne({
    office1: sendingOfficeId,
    office2: receivingOfficeId,
  });
  if (!interaction) {
    const interactionInverse = await Interaction.findOne({
      office1: receivingOfficeId,
      office2: sendingOfficeId,
    });
    if (!interactionInverse) {
      return res
        .status(StatusCodes.OK)
        .json("No documents have been sent from and to this office");
    }
    interaction = interactionInverse;
  }
  const documents = await DocInfo.find({ interaction: interaction._id }).sort({
    updatedAt: 1,
  });
  res.status(StatusCodes.OK).json(documents);
};

const getAllInteractions = async (req, res) => {
  const personalInteractions = await PersonalInteraction.find({
    thisOffice: req.office.officeId,
  })
    .populate("to")
    .sort({ updatedAt: -1 });
  res.status(StatusCodes.OK).json(personalInteractions);
};

module.exports = {
  sendMessage,
  getAllMessage,
  getAllInteractions,
};
