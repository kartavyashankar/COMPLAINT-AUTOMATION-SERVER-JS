const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const app_prop = require("../../../res/app-properties")

const {
	registerValidation,
	loginValidation
} = require("../../controller/routes/validations/validate");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
	const { error } = registerValidation(req.body);
	if (error)
		return res.status(400).json({ message: error.details[0].message });
	try {
		const forceNumExist = await User.findOne({ forceNumber: req.body.forceNumber });
		if (forceNumExist) {
			return res
				.status(409)
				.json({ message: "Force No already registered with us!!" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const user = new User({
			name: req.body.name,
			forceNumber: req.body.forceNumber,
			password: hashedPassword,
			unit: req.body.unit,
			designation: req.body.designation,
			quarterType: req.body.quarterType,
			quarterNumber: req.body.quarterNumber
		});
		const saveUser = await user.save();
		res.status(201).json({
			message: user.userId + "Successfully Registered!!",
		});
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

router.get("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error)
		return res.status(400).json({ message: error.details[0].message });
	try {
		const user = await User.findOne({ forceNumber: req.body.forceNumber });
		if (!user) {
			return res.status(400).json({ message: "User doesn't exists!!" });
		}

		const validPass = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPass) {
			return res.status(400).json({ message: "Invalid Password!!" });
		}

		const token = jwt.sign(
			{ forceNumber: user.forceNumber },
			app_prop.TOKEN_SECRET
		);

		res.status(200).json({
			message: "Login Successful!!",
			forceNumber: user.forceNumber,
			TOKEN: token,
		});
	} catch (err) {
		res.status(500).json({ message: err });
	}
});

module.exports = router;