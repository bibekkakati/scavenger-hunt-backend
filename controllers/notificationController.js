const DB = require("../db/queries");
const { notifyCountToUsername } = require("../emitters/NotificationEmitter");

const getAllNotifications = async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) throw new Error("Username is not present in token");

		const [data, error] = await DB.getNotificationsByUsername(username);
		if (error) throw new Error(error);
		return res.send({
			success: true,
			data,
		});
	} catch (error) {
		return res.send({
			success: false,
			message: error?.message || error,
		});
	}
};

const markNotificationAsRead = async (req, res) => {
	try {
		const { username } = req.body;
		const { id } = req.params;
		if (!username) throw new Error("Username is not present in token");
		if (!id) throw new Error("Notification ID is required");

		const [data, error] = await DB.markNotificationAsRead(id, username);

		notifyCountToUsername(username);

		if (error) throw new Error(error);
		return res.send({
			success: data,
		});
	} catch (error) {
		return res.send({
			success: false,
			message: error?.message || error,
		});
	}
};

module.exports = {
	getAllNotifications,
	markNotificationAsRead,
};
