const express = require("express");
const { addDoctor, getDoctor } = require("../controllers/doctor");
const router = express.Router();

router.post("/", addDoctor);
router.get("/", getDoctor);

module.exports = router;
