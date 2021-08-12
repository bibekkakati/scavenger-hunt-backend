const SocketStore = require("../store/SocketStore");

const sendNotification = async (username, message) => {
	try {
		if (username) {
			const socket = SocketStore.get(username);
			if (!socket) return;
			return socket.emit("notification:message", message);
		}
	} catch (error) {
		return error;
	}
};

module.exports = sendNotification;
