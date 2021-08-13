const events = require("events");
const Events = require("../constants/Events");
const {
	sendNotificationCount,
	sendNotification,
} = require("../socketHandlers");

const NotificationEmitter = new events.EventEmitter();

NotificationEmitter.addListener(Events.NotificationCount, async (usernames) => {
	for (let i = 0; i < usernames.length; i++) {
		sendNotificationCount(usernames[i]);
	}
});

NotificationEmitter.addListener(
	Events.NotificationMessage,
	async (usernames, message) => {
		for (let i = 0; i < usernames.length; i++) {
			sendNotification(usernames[i], message);
		}
	}
);

const notifyCountToUsernames = async (usernames = []) => {
	NotificationEmitter.emit(Events.NotificationCount, usernames);
};

const notifyMessageToUsernames = async (usernames = [], message = "") => {
	NotificationEmitter.emit(Events.NotificationMessage, usernames, message);
};

module.exports = {
	notifyCountToUsernames,
	notifyMessageToUsernames,
};
