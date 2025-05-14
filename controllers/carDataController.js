const carService = require("../services/carDataService.js");

module.exports = {
  getCarData: async function (req, res) {
    try {
      let carData = await carService.getCarData(req.body);
      res
        .status(200)
        .send({ carData, message: "Successfully fetched data" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};
