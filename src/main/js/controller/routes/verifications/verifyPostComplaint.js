const jwt = require("jsonwebtoken");
const User = require("../../models/User");

module.exports = async function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) {
		return res.status(400).json({ message: "Invalid Token!!" });
	}
	try {
		const verification = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await User.findOne({ forceNumber: verification.forceNumber });
		if (verification.userId === req.body.forceNumber && user) {
			next();
		} else {
			res.status(401).json({ message: "Access Denied!!" });
		}
	} catch (err) {
		res.status(400).json({ message: "Invalid Token!!" });
	}
};
