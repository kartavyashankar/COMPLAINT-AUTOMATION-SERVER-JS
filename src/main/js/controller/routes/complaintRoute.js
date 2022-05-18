const express = require('express')
const router = express.Router();
const Complaint = require("../../models/complaint");
const User = require("../../models/user");
const verifyAccess = require("./verifications/verifyToken");
const verifyComplaintAccess = require("./verifications/verifyComplaintAccess");

const {
	postComplaint,
    getComplaint,
	updateComplaint,
    fwd_auth_Complaint,
    rejectComplaint,
    updateFeedback
} = require("./validations/validate");

// 1 -> 2
router.patch("/forward", verifyAccess, async (req, res) => {
    const { error } = fwd_auth_Complaint(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });

        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        } else if(user.designation != "SO" && user.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request!!" });
        }

        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });
        
        if(!complaint) {
            return res.status(400).json({ message : "Complaint Not Found!!" });
        } else if(complaint.status === 0) {
            return res.status(401).json({ message : "Complaint has been rejected!!" });
        } else if(complaint.status === 2) {
            return res.status(401).json({ message: "Complaint has already been forwarded!!" });
        } else if(complaint.status === 3) {
            return res.status(401).json({ message : "Complaint has been authorized!!" });
        } else if(complaint.status === 4) {
            return res.status(401).json({ message : "Complaint has been resolved!!" });
        } 

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status : 2 } });

        return res.status(200).json({ message : "Complaint Forwarded Successfully!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

// 1,2 -> 3
router.patch("/authorize", verifyAccess, async (req, res) => {
    const { error } = fwd_auth_Complaint(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });

        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        } else if(user.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request!!" });
        }
        
        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });
        
        if(!complaint) {
            return res.status(400).json({ message : "Complaint Not Found!!" });
        } else if(complaint.status === 0) {
            return res.status(401).json({ message : "Complaint has been rejected!!" });
        } else if(complaint.status === 3) {
            return res.status(401).json({ message : "Complaint has already been authorized!!" });
        } else if(complaint.status === 4) {
            return res.status(401).json({ message : "Complaint has been resolved!!" });
        }

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status: 3 } });

        return res.status(200).json({ message : "Complaint Authorized Successfully!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

//1,2,3 -> 0
router.patch("/reject", verifyAccess, async (req, res) => {
    const { error } = rejectComplaint(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });

        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        } else if(user.designation != "SO" && user.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request!!" });
        }

        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });

        if(!complaint) {
            return res.status(400).json({ message : "Complaint Not Found!!" });
        }
        else if(complaint.status === 4) {
            return res.status(401).json({ message : "Complaint has been resolved!!" });
        }

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status : 0, reasonOfCancellation : req.body.reasonOfCancellation } });

        return res.status(200).json({ message : "Complaint Rejected Successfully!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.patch("/change", verifyComplaintAccess, async (req, res) => {
    const { error } = updateComplaint(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });

        if(!complaint)
            return res.status(400).json({ message : "Complaint Not Found!!" });
        else if(complaint.status === 4)
            return res.status(401).json({ message : "Complaint has been resolved!!" });

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status : 1,  complaint : req.body.complaint, reasonOfCancellation : "" } });

        return res.status(200).json({ message: "Complaint Updated and status set to 1(Active)!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.patch("/feedback", verifyComplaintAccess, async (req, res) => {
    const { error } = updateFeedback(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });

        if(!complaint)
            return res.status(400).json({ message : "Complaint Not Found!!" });
        else if(complaint.status === 0)
            return res.status(401).json({ message : "Complaint has been rejected!!" });
        else if(complaint.status === 1)
            return res.status(401).json({ message : "Complaint hasn't been forwarded yet!!" });
        else if(complaint.status === 2)
            return res.status(401).json({ message : "Complaint hasn't been authorized yet!!" });

        const updatedComplaint = await Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status : 4, feedbackRating : req.body.feedbackRating, resolutionDate : Date.now() } });

        return res.status(200).json({ message: "Thanks for your Feedback!!" });
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
        const complaint = await Complaint.findOne({ complaintNumber : req.body.complaintNumber });

        if(complaint)
            return res.status(400).json({ message : "Complaint already exists!!" });
        
        const new_complaint = new Complaint({
			complaintNumber: req.body.complaintNumber,
			forceNumber: req.body.forceNumber,
			quarterNumber: req.body.quarterNumber,
            category: req.body.category,
            complaint: req.body.complaint
		});
		const savePost = await new_complaint.save();
		return res.status(201).json({ message : "Complaint Registered!!" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.get("/activeComplaints", verifyComplaintAccess, async (req, res) => {
    const { error } = getComplaint(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });
        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        }
        else if(user.designation === "SO" || user.designation === "DC") {
            const complaints = Complaint.find({ status : [1,2,3] });
            return res.status(200).json(complaints);
        }

        const complaints = Complaint.find({ forceNumber : req.body.forceNumber, status : [1,2,3] });
		return res.status(200).json(complaints);
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.get("/resolvedComplaints", verifyComplaintAccess, async (req, res) => {
    const { error } = getComplaint(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });
        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        }
        else if(user.designation === "SO" || user.designation === "DC") {
            const complaints = Complaint.find({ status : 4 });
            return res.status(200).json(complaints);
        }

        const complaints = Complaint.find({ forceNumber : req.body.forceNumber, status : 4 });
		return res.status(200).json(complaints);
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.get("/rejectedComplaints", verifyComplaintAccess, async (req, res) => {
    const { error } = getComplaint(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        const user = await User.findOne({ forceNumber : req.body.forceNumber });
        if(!user) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND!!" });
        }
        else if(user.designation === "SO" || user.designation === "DC") {
            const complaints = Complaint.find({ status : 0 });
            return res.status(200).json(complaints);
        }

        const complaints = Complaint.find({ forceNumber : req.body.forceNumber, status : 0 });
		return res.status(200).json(complaints);
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

module.exports = router;