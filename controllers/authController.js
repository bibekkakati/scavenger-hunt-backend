const bcrypt = require("bcrypt");
const DB = require("../db/queries");
const issueAuthToken = require("../helpers/issueAuthToken");

const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password)
			return res.send({
				success: false,
				message: "Username and Password is required.",
			});

		const [data, error] = await DB.getUser(username);
		if (error) throw new Error(error);

		const passwordMatched = await bcrypt.compare(password, data.password);
		if (!passwordMatched) throw new Error("Incorrect password");

		const token = issueAuthToken({
			username: data.username,
			role: data.role,
		});
		if (!token) throw new Error("Couldn't generate auth token");

		return res.send({
			success: true,
			message: "Loggedin successfully",
			token: token,
			role: data.role,
		});
	} catch (error) {
		return res.send({
			success: false,
			message: error?.message || error,
		});
	}
};

module.exports = { login };
