const express = require('express')
const router = express.Router();

router.get("/user", (req, res) => {
    // Login
});

router.patch("/user/complaint/fwd", (req, res) => {
    // Complaint Forwarding
});

router.patch("/user/complaint/auth", (req, res) => {
    // Complaint Authorization
});

router.patch("/user/complaint/rej", (req, res) => {
    // Complaint Reject
});

router.patch("/user/complaint/chng", (req, res) => {
    // Complaint Status Change
});

router.post("/user/complaint", (req, res) => {
    //Add Complaint
});

module.exports = router;