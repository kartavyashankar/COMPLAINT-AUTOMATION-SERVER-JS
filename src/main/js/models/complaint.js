const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema(
	{
		complaintNumber: {
			type: Number
		},
        forceNumber: {
            type: String,
            required: true
        },
		quarterNumber: {
			type: Number,
			required: true
		},
        category: {
            type: String,
            required: true
        },
        complaint: {
			type: String,
			required: true
		},
        registrationDate: {
            type: Date,
			default: Date.now
        },
        status : {
            type: Number,
            default: 1
        },
        resolutionDate : {
            type: Date
        },
        reasonOfCancellation: {
            type: String
        },
        feedbackRating: {
            type: Number,
            default: 0
        }
	},
	{ versionKey: false }
);

module.exports = mongoose.model("complaints", complaintSchema);
