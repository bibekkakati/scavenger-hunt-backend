const Admin = require("../constants/Admin");
const Roles = require("../constants/Roles");
const DB = require("../db/queries");
const {
	notifyMessageToUsernames,
	notifyCountToUsernames,
} = require("../emitters/NotificationEmitter");

const writeNotification = async (usernames = [], message = "") => {
	console.log(usernames, message);
	for (let i = 0; i < usernames.length; i++) {
		DB.insertNotification(usernames[i], message);
	}
	notifyMessageToUsernames(usernames, message);
	notifyCountToUsernames(usernames);
};

const searchBranchByPincode = async (req, res) => {
	try {
		const { pincode } = req.query;
		if (!pincode) throw new Error("Pincode is required");

		const [data, error] = await DB.getBranchesByPincode(pincode);
		const message = `Someone searched @${pincode}`;
		// Notifying Admin
		writeNotification([Admin.adminUsername], message);

		if (error) throw new Error(error);

		const branchUsernames = [];
		const branches = [];
		for (let i = 0; i < data.length; i++) {
			const temp = data[i];
			branchUsernames.push(temp.username);
			delete temp.username;
			branches.push(temp);
		}
		// Notifying Branches
		writeNotification(branchUsernames, message);

		return res.send({
			success: true,
			data: branches,
		});
	} catch (error) {
		return res.send({
			success: false,
			error: error?.message || error,
		});
	}
};

const getAllBranches = async (req, res) => {
	try {
		const { role } = req.body;
		if (role && role === Roles.admin) {
			const [data, error] = await DB.getAllBranches();
			if (error) throw new Error(error);
			return res.send({
				success: true,
				data,
			});
		}
		throw new Error("Unauthorized");
	} catch (error) {
		return res.send({
			success: false,
			message: error?.message || error,
		});
	}
};

const getBranchDetails = async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) throw new Error("Username is not present in token");

		const [data, error] = await DB.getBranchByUsername(username);
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

module.exports = {
	searchBranchByPincode,
	getAllBranches,
	getBranchDetails,
};
