const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

const app_prop = require("../../../res/app-properties");
const Worker = require("../../models/worker");
const {
    workerRegisterValidation,
    loginValidation,
  } = require("./validations/validate");

const router = express.router();

router.post("/login", async(req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
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

router.post("/register", async(req, res) => {
    try {
        const { error } = workerRegisterValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const workerExist = await Worker.findOne({ forceNumber: req.body.forceNumber });
        if (workerExist) {
            return res.status(409).json({ message: "WORKER_ALREADY_REGISTERED!!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const worker = new Worker({
            name: req.body.name,
            forceNumber: req.body.forceNumber,
            password: hashedPassword,
            unit: req.body.unit,
            category: req.body.category,
            quarterType: req.body.quarterType,
            quarterNumber: req.body.quarterNumber,
        });
        const saveWorker = await worker.save();
        res.status(201).json({
            message: "Successfully Registered!!",
        });
    } catch (err) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
});