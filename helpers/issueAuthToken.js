const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("./keys/rsa_private.pem");
const algorithm = process.env.JWT_ALGO;

const issueAuthToken = (payload) => {
	try {
		const token = jwt.sign(payload, privateKey, {
			algorithm,
			expiresIn: 60 * 60 * 24 * 5,
		});
		return token;
	} catch (error) {
		return null;
	}
};

module.exports = issueAuthToken;
