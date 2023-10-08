var express = require("express");
router = express.Router();
const { signup, signin } = require("../controllers/authentication");

router.post("/register", signup);

router.post("/login", signin);

module.exports = router;