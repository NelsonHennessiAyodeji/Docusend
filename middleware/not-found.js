const notFound = (req, res, next) => {
    res.status(404).json("The route that you have provided does not exists");
}

module.exports = notFound;