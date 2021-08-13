const jwt = require("jsonwebtoken");
const fs = require("fs");

const publicKey = fs.readFileSync("./keys/rsa_public.pem");
const algorithm = process.env.JWT_ALGO;

const verifyAuthToken = (req, res, next) => {
	try {
		let token = req.headers.authorization;
		if (token && token.startsWith("Bearer ")) {
			token = token.substring(7, token.length);
			const payload = jwt.verify(token, publicKey, {
				algorithms: [algorithm],
			});
			req.body.username = payload.username;
			req.body.role = payload.role;
			return next();
		}
		return res.send({
			success: false,
			message: "Auth token is missing",
		});
	} catch (error) {
		if (error.message === "jwt expired") {
			return res.send({
				success: false,
				message: "Token expired",
				expired: true,
			});
		}
		return res.send({
			success: false,
			message: "Authentication failed",
		});
	}
};

module.exports = verifyAuthToken;
