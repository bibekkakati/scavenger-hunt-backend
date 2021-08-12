const { notificationController } = require("../controllers");

const router = require("express").Router();

router.post("/markread", notificationController.markNotificationAsRead);
router.get("/all", notificationController.getAllNotifications);

module.exports = router;
