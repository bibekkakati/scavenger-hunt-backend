const { notificationController } = require("../controllers");
const verifyAuthToken = require("../middlewares/verifyAuthToken");

const router = require("express").Router();

router.use(verifyAuthToken);
router.post("/markread/:id", notificationController.markNotificationAsRead);
router.get("/all", notificationController.getAllNotifications);

module.exports = router;
