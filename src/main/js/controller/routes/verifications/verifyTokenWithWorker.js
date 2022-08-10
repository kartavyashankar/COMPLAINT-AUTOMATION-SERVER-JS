const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const Worker = require("../../../models/worker");
const app_prop = require("../../../../res/app-properties");

module.exports = async function (req, res, next) {
	try {
        const token = req.header("auth-token");
        if (!token) {
            return res.status(400).json({ message: "Invalid Token!!" });
        }
		const verification = jwt.verify(token, app_prop.TOKEN_SECRET);
		const user = await User.findOne({ forceNumber: verification.forceNumber });
		if (user) next();
		else {
            const worker = await Worker.findOne({ forceNumber: verification.forceNumber });
            if(worker) next();
            else {
			    res.status(401).json({ message: "Access Denied!!" });
            }
		}
	} catch (err) {
		res.status(500).json({ message: "INTERNAL SERVER ERROR" });
	}
};