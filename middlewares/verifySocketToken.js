const jwt = require("jsonwebtoken");

const algorithm = process.env.JWT_ALGO;
const secret = process.env.JWT_SECRET;

const verifySocketToken = (token) => {
	try {
		if (token) {
			const payload = jwt.verify(token, secret);
			return payload.username;
		}
		return false;
	} catch (error) {
		return false;
	}
};

module.exports = verifySocketToken;
