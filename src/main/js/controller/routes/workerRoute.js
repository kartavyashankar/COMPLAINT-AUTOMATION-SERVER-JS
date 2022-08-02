const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

const app_prop = require("../../../res/app-properties");
const Worker = require("../../models/worker");

const router = express.router();

router.post("/login", async(req, res) => {
    try {

        const worker = Worker.findOne({ forceNumber: req.body.forceNumber });
        if(!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }
        const validPass = await bcrypt.compare(worker.password, req.body.password);
        if(!validPass) {
            return res.status(401).json({ message: "Invalid Password!!" });
        }
        const token = jwt.sign(
            { forceNumber: worker.forceNumber },
            app_prop.TOKEN_SECRET
        );
        res.status(200).json({
            message: "Login Successful!!",
            forceNumber: worker.forceNumber,
            category: worker.category,
            TOKEN: token,
        });

    } catch (err) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
});
