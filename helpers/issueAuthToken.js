const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const issueAuthToken = (payload) => {
	try {
		const token = jwt.sign(payload, secret, {
			expiresIn: 60 * 60 * 24 * 5,
		});
		return token;
	} catch (error) {
		console.log(error);
		return null;
	}
};

module.exports = issueAuthToken;
