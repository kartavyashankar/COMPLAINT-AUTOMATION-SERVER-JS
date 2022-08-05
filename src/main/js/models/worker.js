const mongoose = require("mongoose");

const workerSchema = mongoose.Schema({
    forceNumber: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    name: {
        type: String,
        required: true
    },
    quarterType: {
        type: Number,
        required: true
    },
    quarterNumber: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    assignedJobs: {
        type: [String],
        default: []
    },
    isActive: {
        type: Number,
        default: 1
    },
    pushNotificationToken: {
        type: String,
    }
}, { versionKey: false });

module.exports = mongoose.model("workers", workerSchema);