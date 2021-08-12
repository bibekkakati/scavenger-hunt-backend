const Roles = require("../constants/Roles");
const DB = require("../db/queries");

const searchBranchByPincode = async (req, res) => {
	try {
		const { pincode } = req.query;
		if (!pincode) throw new Error("Pincode is required");

		const [data, error] = await DB.getBranchesByPincode(pincode);

		// TODO: notify admin

		if (error) throw new Error(error);

		// TODO: notify branch userids

		return res.send({
			success: true,
			data,
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
