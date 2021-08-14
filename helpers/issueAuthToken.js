const jwt = require("jsonwebtoken");

const algorithm = process.env.JWT_ALGO;
const secret = process.env.JWT_SECRET;

const issueAuthToken = (payload) => {
	try {
		const token = jwt.sign(payload, secret, {
			algorithm,
			expiresIn: 60 * 60 * 24 * 5,
		});
		return token;
	} catch (error) {
		return null;
	}
};

module.exports = issueAuthToken;
