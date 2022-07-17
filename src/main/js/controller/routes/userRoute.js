const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const app_prop = require("../../../res/app-properties");

const {
  registerValidation,
  loginValidation,
} = require("./validations/validate");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /user/register:
 *  post:
 *   tags:
 *    - "User Routes"
 *   summary: Register a new User
 *   description: Add a new User to the system.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: The user's name.
 *         example: Leanne Graham
 *        forceNumber:
 *         type: string
 *         description: User's forceNumber.
 *         example: abc123456
 *        password:
 *         type: string
 *         description: User's password.
 *         example: Strong password 123
 *        unit:
 *         type: string
 *         description: User's Unit Number.
 *        designation:
 *         type: string
 *         description: User's designation.
 *        quaterType:
 *         type: number
 *         description: User's Quater Type.
 *        quaterNumber:
 *         type: number
 *         description: User's Quater Number.
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *    500:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *
 *
 */

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const userExist = await User.findOne({ forceNumber: req.body.forceNumber });
    if (userExist) {
      return res.status(409).json({ message: "USER_ALREADY_REGISTERED!!" });
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
      quarterNumber: req.body.quarterNumber,
    });
    const saveUser = await user.save();
    res.status(201).json({
      message: "Successfully Registered!!",
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /user/login:
 *  post:
 *   tags:
 *    - "User Routes"
 *   summary: Sign in user
 *   description: Create a session for the user.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        forceNumber:
 *         type: string
 *         description: User's forceNumber.
 *         example: abc123456
 *        password:
 *         type: string
 *         description: User's password.
 *         example: Strong password 123
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *    400:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *    401:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *    404:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *    500:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *
 *
 */
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const user = await User.findOne({ forceNumber: req.body.forceNumber });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exists!!" });
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) {
      return res.status(401).json({ message: "Invalid Password!!" });
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
