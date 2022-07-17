const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const app_prop = require("../../../../res/app-properties")

module.exports = async function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) {
		return res.status(400).json({ message: "Invalid Token!!" });
	}
	try {
		const verification = jwt.verify(token, app_prop.TOKEN_SECRET);
		const user = await User.findOne({ forceNumber: verification.forceNumber });
		if(!user) {
            return res.status(404).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        } else if(
				user.designation != "SO" && 
				user.designation != "IC" && 
				user.designation != "DC"
			) {
            return res.status(401).json({ message : "Forbidden Request!!" });
        }
		next();
	} catch (err) {
		res.status(400).json({ message: "Invalid Token!!" });
	}
};