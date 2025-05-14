const carData = require("../models/Car.js");

module.exports = {
  getCarData: async function () {
    return await carData.find({}, { _id: 0, created_at: 0, updated_at: 0 });
  },
};
