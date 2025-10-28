const express = require("express");
const { analyzePlant } = require("../controllers/plant.controller.js");
const upload = require("../middleware/upload");

const router = express.Router();

// POST /api/plant/analyze
router.post("/analyze", upload.single("image"), analyzePlant);

module.exports = router;
