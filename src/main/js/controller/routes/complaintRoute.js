const express = require('express')
const router = express.Router();
const Complaint = require("../../models/complaint");
const User = require("../../models/user");
const verifyAccess = require("./verifications/verifyToken");
const verifyComplaintAccess = require("./verifications/verifyComplaintAccess");
const jwt = require("jsonwebtoken");
const app_prop = require("../../../res/app-properties")

const {
	postComplaint,
    authComplaint,
    rejectComplaint,
    resolveComplaint
} = require("./validations/validate");
const verifyToken = require('./verifications/verifyToken');

// 1 -> 2
router.patch("/authorize", verifyAccess, async (req, res) => {
    const { error } = authComplaint(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });

        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        } else if(user.designation != "SO" && user.designation != "IC" && user.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request!!" });
        }
        
        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });
        
        if(!complaint) {
            return res.status(400).json({ message : "Complaint Not Found!!" });
        } else if(complaint.status === 0) {
            return res.status(401).json({ message : "Complaint has been rejected!!" });
        } else if(complaint.status === 2) {
            return res.status(401).json({ message : "Complaint has already been authorized!!" });
        } else if(complaint.status === 3) {
            return res.status(401).json({ message : "Complaint has been resolved!!" });
        }

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status: 2 } });

        return res.status(200).json({ message : "Complaint Authorized Successfully!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

// 2 -> 3
router.patch("/resolve", verifyAccess, async (req, res) => {
    const { error } = resolveComplaint(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });

        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        } else if(user.designation != "SO" && user.designation != "IC" && user.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request!!" });
        }

        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });

        if(!complaint)
            return res.status(400).json({ message : "Complaint Not Found!!" });
        else if(complaint.status === 0)
            return res.status(401).json({ message : "Complaint has been rejected!!" });
        else if(complaint.status === 1)
            return res.status(401).json({ message : "Complaint hasn't been authorized yet!!" });
        else if(complaint.status === 3) 
        return res.status(401).json({ message : "Complaint has already been resolved!!" });

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status : 3, resolutionDate : Date.now() } });

        return res.status(200).json({ message: "Complaint Resolved Successfully!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

//1,2 -> 0
router.patch("/reject", verifyAccess, async (req, res) => {
    const { error } = rejectComplaint(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });

        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        } else if(user.designation != "SO" && user.designation != "IC" && user.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request!!" });
        }

        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });

        if(!complaint) {
            return res.status(400).json({ message : "Complaint Not Found!!" });
        }
        else if(complaint.status === 3) {
            return res.status(401).json({ message : "Complaint has already been resolved!!" });
        }

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status : 0 } });

        return res.status(200).json({ message : "Complaint Rejected Successfully!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.post("/", verifyComplaintAccess, async (req, res) => {
    const { error } = postComplaint(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const complaint = await Complaint.findOne({ complaint : req.body.complaint, category : req.body.category });
        if(complaint)
            return res.status(400).json({ message : "Complaint already exists!!" });
        const user = await User.findOne({ forceNumber : req.body.forceNumber })
        
        const new_complaint = new Complaint({
            name: user.name,
			forceNumber: req.body.forceNumber,
			quarterNumber: user.quarterNumber,
            category: req.body.category,
            complaint: req.body.complaint
		});
		const savePost = await new_complaint.save();
		return res.status(201).json({ message : "Complaint Registered!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token");
        const findUser = jwt.verify(token, app_prop.TOKEN_SECRET);
        const user = await User.findOne({ forceNumber : findUser.forceNumber });
        let complaints = [];
        let complaints_level = [];
        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        }
        else if(user.designation === "SO" && user.designation === "IC" && user.designation === "DC") {
            complaints_level = await Complaint.find({ status : [1,2,3], forceNumber: { $ne: user.forceNumber } });
        }
        complaints = await Complaint.find({ forceNumber : user.forceNumber});
        complaints = complaints.concat(complaints_level);
        complaints.sort((a, b) => b.complaintNumber - a.complaintNumber);
		return res.status(200).json(complaints);
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.get("/active", verifyToken, async (req, res) => {
    try {
        const token = req.header("auth-token");
        const findUser = jwt.verify(token, app_prop.TOKEN_SECRET);
        const user = await User.findOne({ forceNumber : findUser.forceNumber });
        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        }
        const complaints = await Complaint.find({ status : [1,2] }).sort({ complaintNumber : -1 });
		return res.status(200).json(complaints);
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

module.exports = router;