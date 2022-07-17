const express = require("express");
const router = express.Router();
const Complaint = require("../../models/complaint");
const User = require("../../models/user");
const verifyAccess = require("./verifications/verifyToken");
const verifyComplaintAccess = require("./verifications/verifyComplaintAccess");
const jwt = require("jsonwebtoken");
const app_prop = require("../../../res/app-properties");

const {
  postComplaint,
  authComplaint,
  rejectComplaint,
  resolveComplaint,
} = require("./validations/validate");
const verifyToken = require("./verifications/verifyToken");

/**
 * @swagger
 * /user/complaint/authorize:
 *  patch:
 *   tags:
 *    - "Complaint Routes"
 *   summary: Authorize a complaint
 *   description: Authorize a complaint.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        forceNumber:
 *         type: String
 *         description: User's forceNumber.
 *         example: 123456
 *        complaintNumber:
 *         type: String
 *         description: ID of the complaint
 *         example: 01/20
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Success Message
 *
 *    401:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Unauthorized Message
 *
 *    404:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Found Message
 *
 *    405:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Allowed Message
 *
 *    500:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Internal Error Message
 *
 */
// 1 -> 2
router.patch("/authorize", verifyAccess, async (req, res) => {
  const { error } = authComplaint(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ forceNumber: req.body.forceNumber });

    if (!user) {
      return res.status(400).json({ message: "FATAL_ERROR_USER_NOT_FOUND!!" });
    } else if (
      user.designation != "SO" &&
      user.designation != "IC" &&
      user.designation != "DC"
    ) {
      return res.status(401).json({ message: "Forbidden Request!!" });
    }

    const complaint = await Complaint.findOne({
      complaintNumber: req.body.complaintNumber,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint Not Found!!" });
    } else if (complaint.status === 0) {
      return res.status(401).json({ message: "Complaint has been rejected!!" });
    } else if (complaint.status === 2) {
      return res
        .status(405)
        .json({ message: "Complaint has already been authorized!!" });
    } else if (complaint.status === 3) {
      return res
        .status(405)
        .json({ message: "Complaint has already been resolved!!" });
    }

    const updatedComplaint = await Complaint.updateOne(
      { complaintNumber: req.body.complaintNumber },
      { $set: { status: 2 } }
    );

    return res
      .status(200)
      .json({ message: "Complaint Authorized Successfully!!" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /user/complaint/resolve:
 *  patch:
 *   tags:
 *    - "Complaint Routes"
 *   summary: Resolve a complaint
 *   description: Resolve a complaint.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        forceNumber:
 *         type: String
 *         description: User's forceNumber.
 *         example: 123456
 *        complaintNumber:
 *         type: String
 *         description: ID of the complaint
 *         example: 01/20
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Success Message
 *
 *    401:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Unauthorized Message
 *
 *    404:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Found Message
 *
 *    405:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Allowed Message
 *
 *    500:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Internal Error Message
 *
 */

// 2 -> 3
router.patch("/resolve", verifyAccess, async (req, res) => {
  const { error } = resolveComplaint(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ forceNumber: req.body.forceNumber });

    if (!user) {
      return res.status(400).json({ message: "FATAL_ERROR_USER_NOT_FOUND!!" });
    } else if (
      user.designation != "SO" &&
      user.designation != "IC" &&
      user.designation != "DC"
    ) {
      return res.status(401).json({ message: "Forbidden Request!!" });
    }

    const complaint = await Complaint.findOne({
      complaintNumber: req.body.complaintNumber,
    });

    if (!complaint)
      return res.status(404).json({ message: "Complaint Not Found!!" });
    else if (complaint.status === 0)
      return res.status(401).json({ message: "Complaint has been rejected!!" });
    else if (complaint.status === 1)
      return res
        .status(405)
        .json({ message: "Complaint hasn't been authorized yet!!" });
    else if (complaint.status === 3)
      return res
        .status(405)
        .json({ message: "Complaint has already been resolved!!" });

    const updatedComplaint = await Complaint.updateOne(
      { complaintNumber: req.body.complaintNumber },
      { $set: { status: 3, resolutionDate: Date.now() } }
    );

    return res
      .status(200)
      .json({ message: "Complaint Resolved Successfully!!" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /user/complaint/reject:
 *  patch:
 *   tags:
 *    - "Complaint Routes"
 *   summary: Reject a complaint
 *   description: Reject a complaint.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        forceNumber:
 *         type: String
 *         description: User's forceNumber.
 *         example: 123456
 *        complaintNumber:
 *         type: String
 *         description: ID of the complaint
 *         example: 01/20
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Success Message
 *
 *    401:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Unauthorized Message
 *
 *    404:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Found Message
 *
 *    405:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Allowed Message
 *
 *    500:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Internal Error Message
 *
 */

//1,2 -> 0
router.patch("/reject", verifyAccess, async (req, res) => {
  const { error } = rejectComplaint(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ forceNumber: req.body.forceNumber });

    if (!user) {
      return res.status(404).json({ message: "FATAL_ERROR_USER_NOT_FOUND!!" });
    } else if (
      user.designation != "SO" &&
      user.designation != "IC" &&
      user.designation != "DC"
    ) {
      return res.status(401).json({ message: "Forbidden Request!!" });
    }

    const complaint = await Complaint.findOne({
      complaintNumber: req.body.complaintNumber,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint Not Found!!" });
    } else if (complaint.status === 3) {
      return res
        .status(405)
        .json({ message: "Complaint has already been resolved!!" });
    }

    const updatedComplaint = await Complaint.updateOne(
      { complaintNumber: req.body.complaintNumber },
      { $set: { status: 0 } }
    );

    return res
      .status(200)
      .json({ message: "Complaint Rejected Successfully!!" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /user/complaint/:
 *  post:
 *   tags:
 *    - "Complaint Routes"
 *   summary: Register a complaint
 *   description: Register a complaint.
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        forceNumber:
 *         type: String
 *         description: User's forceNumber
 *         example: 123456
 *        complaint:
 *         type: String
 *         description: Complaint
 *         example: Null 3 kharab hai
 *        category:
 *         type: String
 *         description: Type of Complaint
 *         example: Plumbing
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Success Message
 *
 *    401:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Unauthorized Message
 *
 *    404:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Found Message
 *
 *    405:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Not Allowed Message
 *
 *    500:
 *     content:
 *      appication/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: String
 *          description: Internal Error Message
 *
 */

router.post("/", verifyComplaintAccess, async (req, res) => {
  const { error } = postComplaint(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await User.findOne({ forceNumber: req.body.forceNumber });
    const complaints = await Complaint.find();
    const new_complaint = new Complaint({
      name: user.name,
      forceNumber: req.body.forceNumber,
      quarterNumber: user.quarterNumber,
      category: req.body.category,
      complaint: req.body.complaint,
      complaintNumber: complaints.length + 101,
    });
    const savePost = await new_complaint.save();
    return res.status(201).json({ message: "Complaint Registered!!" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const token = req.header("auth-token");
    const findUser = jwt.verify(token, app_prop.TOKEN_SECRET);
    const user = await User.findOne({ forceNumber: findUser.forceNumber });
    let complaints = [];
    let complaints_level = [];
    if (!user) {
      return res.status(400).json({ message: "FATAL_ERROR_USER_NOT_FOUND!!" });
    } else if (
      user.designation === "SO" ||
      user.designation === "IC" ||
      user.designation === "DC"
    ) {
      complaints_level = await Complaint.find({
        status: [0, 1, 2, 3],
        forceNumber: { $ne: user.forceNumber },
      });
    }
    complaints = await Complaint.find({ forceNumber: user.forceNumber });
    complaints = complaints.concat(complaints_level);
    complaints.sort((a, b) => b.complaintNumber - a.complaintNumber);
    return res.status(200).json(complaints);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});
/**
 * @swagger
 * /user/complaint/active:
 *  get:
 *   tags:
 *    - "Complaint Routes"
 *   summary: Get active complaints of the user.
 *   description: .
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
 *         complaints:
 *          type: List
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

router.get("/active", verifyToken, async (req, res) => {
  try {
    const token = req.header("auth-token");
    const findUser = jwt.verify(token, app_prop.TOKEN_SECRET);
    const user = await User.findOne({ forceNumber: findUser.forceNumber });
    if (!user) {
      return res.status(404).json({ message: "FATAL_ERROR_USER_NOT_FOUND!!" });
    }
    const complaints = await Complaint.find({ status: [1, 2] }).sort({
      complaintNumber: -1,
    });
    return res.status(200).json(complaints);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports = router;
