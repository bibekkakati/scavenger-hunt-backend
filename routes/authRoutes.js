const { authController } = require("../controllers");
const router = require("express").Router();

router.post("/login", authController.login);

module.exports = router;