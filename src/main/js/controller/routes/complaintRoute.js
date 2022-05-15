const express = require('express')
const validater = require("../../controller/routes/validations/validate");
const { update } = require('../../models/complaint');
const router = express.Router();
const Complaint = require("../../models/complaint");
const User = require("../../models/user");

router.patch("/forward", (req, res) => {
    let { error } = validater.updateComplaintHandler(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        let updater = User.findOne({ forceNumber : req.body.forceNumber });

        if(!updater) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND" });
        } else if(updater.designation != "SO") {
            return res.status(401).json({ message : "Forbidden Request" });
        }

        const complaint = Complaint.findOne({ complaintNumber : req.body.complaintNumber });
        
        if(!complaint) {
            res.status(400).json({ message : "Complaint Not Found" });
        } else if(complaint.status === 4) {
            return res.status(401).json({ message : "Complaint has been rejected" });
        } else if(complaint.status === 2) {
            return res.status(401).json({ message : "Complaint has already been resolved" });
        } else if(complaint.status === 3) {
            return res.status(401).json({ message : "Complaint has already been authorized" });
        }

        const updatedComplaint = Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { handler : "DC" } });

        return res.status(200).json({ message : "Complaint Forwarded Successfully" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.patch("/authorize", (req, res) => {
    // Complaint Authorization
    let { error } = validater.updateComplaintHandler(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        let updater = User.findOne({ forceNumber : req.body.forceNumber });

        if(!updater) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND" });
        } else if(updater.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request" });
        }
        const complaint = Complaint.findOne({ complaintNumber : req.body.complaintNumber });
        
        if(!complaint) {
            res.status(400).json({ message : "Complaint Not Found" });
        } else if(complaint.status === 4) {
            return res.status(401).json({ message : "Complaint has been rejected" });
        } else if(complaint.status === 2) {
            return res.status(401).json({ message : "Complaint has already been resolved" });
        } else if(complaint.status === 3) {
            return res.status(401).json({ message : "Complaint has already been authorized" });
        }

        const updatedComplaint = Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { handler : "SO", status: 3 } });

        return res.status(200).json({ message : "Complaint Authorized Successfully" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.patch("/reject", (req, res) => {
    // Complaint Reject
    let { error } = validater.updateComplaintHandler(req.body);

    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        let updater = User.findOne({ forceNumber : req.body.forceNumber });

        if(!updater) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND" });
        } else if(updater.designation != "DC") {
            return res.status(401).json({ message : "Forbidden Request" });
        }
        const complaint = Complaint.findOne({ complaintNumber : req.body.complaintNumber });
        
        if(!complaint) {
            res.status(400).json({ message : "Complaint Not Found" });
        } else if(complaint.status === 4) {
            return res.status(401).json({ message : "Complaint has been rejected" });
        } else if(complaint.status === 2) {
            return res.status(401).json({ message : "Complaint has already been resolved" });
        } else if(complaint.status === 3) {
            return res.status(401).json({ message : "Complaint has already been authorized" });
        }

        const updatedComplaint = Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { handler : "SO", status: 4 } });

        return res.status(200).json({ message : "Complaint Authorized Successfully" });
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.patch("/change", (req, res) => {
    // Complaint Status Change
    let { error } = validater.updateComplaintStatus(req.body);
    if(error) {
        return res.status(400).json({ message : error.details[0].message });
    }
    try {
        let updater = User.findOne({ forceNumber : req.body.forceNumber });

        if(!updater) {
            return res.status(400).json({ message : "FATAL_ERROR_USER_NOT_FOUND" });
        } else if(updater.designation != "SO") {
            return res.status(401).json({ message : "Forbidden Request" });
        }
        const complaint = Complaint.findOne({ complaintNumber : req.body.complaintNumber });
        
        if(!complaint) {
            res.status(400).json({ message : "Complaint Not Found" });
        } else if(complaint.status === 4) {
            return res.status(401).json({ message : "Complaint has been rejected" });
        } else if(complaint.status === 2) {
            return res.status(401).json({ message : "Complaint has already been resolved" });
        }

        const updatedComplaint = Complaint.updateOne({ complaintNumber : req.body.complaintNumber }, { $set: { status : req.body.status } });
        
        return res.status(200).json(updatedComplaint);
    } catch(err) {
        return res.status(500).json({ message : err });
    }
});

router.post("/", (req, res) => {
    //Add Complaint
});

// Get Complaint Status -> level_wise
router.get("/", (req, res) => {
    
});

module.exports = router;