const express = require('express');
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const farmerController = require('../controllers/farmers');


router.post("/", checkAuth, extractFile, farmerController.addFarmer);

router.put("/:id", checkAuth, extractFile, farmerController.updateFarmer);

router.get('/', farmerController.getFarmers);

router.get('/:id', farmerController.getFarmerById);

router.delete('/:id', checkAuth, farmerController.deleteFarmerById);

module.exports = router;