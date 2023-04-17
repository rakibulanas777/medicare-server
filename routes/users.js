const express = require("express");
const { getUsers, login, register, protect } = require("../controllers/user");
const router = express.Router();

router.post("/", register);
router.get("/", getUsers);
router.post("/login", login);

module.exports = router;
