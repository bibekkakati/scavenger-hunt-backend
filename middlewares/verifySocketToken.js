const jwt = require("jsonwebtoken");
const fs = require("fs");

const publicKey = fs.readFileSync("./keys/rsa_public.pem");
const algorithm = process.env.JWT_ALGO;

const verifySocketToken = (token) => {
	try {
		if (token) {
			const payload = jwt.verify(token, publicKey, {
				algorithms: [algorithm],
			});
			return payload.username;
		}
		return false;
	} catch (error) {
		return false;
	}
};

module.exports = verifySocketToken;
