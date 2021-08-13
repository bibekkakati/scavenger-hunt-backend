const events = require("events");
const Events = require("../constants/Events");
const {
	sendNotificationCount,
	sendNotification,
} = require("../socketHandlers");

const NotificationEmitter = new events.EventEmitter();

NotificationEmitter.addListener(Events.NotificationCount, async (username) => {
	sendNotificationCount(username);
});

NotificationEmitter.addListener(
	Events.NotificationMessage,
	async (username, message) => {
		sendNotification(username, message);
	}
);

const notifyCountToUsername = async (username) => {
	NotificationEmitter.emit(Events.NotificationCount, username);
};

const notifyMessageToUsername = async (username, message = {}) => {
	NotificationEmitter.emit(Events.NotificationMessage, username, message);
};

module.exports = {
	notifyCountToUsername,
	notifyMessageToUsername,
};
