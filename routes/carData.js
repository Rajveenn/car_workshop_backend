const express = require("express");
const router = express.Router();
const carDataController = require("../controllers/carDataController.js");

router.get("/carData", carDataController.getCarData);
// router.get("/models", carDataController.getModels);

module.exports = router;