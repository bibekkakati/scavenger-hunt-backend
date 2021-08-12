const DB = require("../db/queries");
const SocketStore = require("../store/SocketStore");

const sendNotificationCount = async (username) => {
	try {
		if (username) {
			const socket = SocketStore.get(username);
			if (!socket) return;
			const [count, error] = await DB.getNotificationCount(username);
			if (error) throw new Error(error);
			socket.emit("notification:count", count);
		}
	} catch (error) {
		return error;
	}
};

module.exports = sendNotificationCount;
