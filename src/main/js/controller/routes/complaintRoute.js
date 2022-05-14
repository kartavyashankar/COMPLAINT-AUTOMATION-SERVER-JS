const express = require('express')
const router = express.Router();

router.patch("/forward", (req, res) => {
    // Complaint Forwarding
});

router.patch("/authorize", (req, res) => {
    // Complaint Authorization
});

router.patch("/reject", (req, res) => {
    // Complaint Reject
});

router.patch("/change", (req, res) => {
    // Complaint Status Change
});

router.post("/", (req, res) => {
    //Add Complaint
});

// Get Complaint Status -> level_wise
router.get("/", (req, res) => {
    
});

module.exports = router;