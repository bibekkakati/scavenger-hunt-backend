const jwt = require("jsonwebtoken");

const algorithm = process.env.JWT_ALGO;
const secret = process.env.JWT_SECRET;

const verifyAuthToken = (req, res, next) => {
	try {
		let token = req.headers.authorization;
		if (token && token.startsWith("Bearer ")) {
			token = token.substring(7, token.length);
			const payload = jwt.verify(token, secret, {
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
			expired: true,
		});
	}
};

module.exports = verifyAuthToken;
