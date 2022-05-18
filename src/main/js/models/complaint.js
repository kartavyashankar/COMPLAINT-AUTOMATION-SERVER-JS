const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema(
	{
		complaintNumber: {
			type: Number,
			required: true  
		},
        forceNumber: {
            type: Number,
            required: true
        },
		quarterNumber: {
			type: Number,
			required: true
		},
        category: {
            type: Number,
            required: true
        },
        complaint: {
			type: String,
			required: true
		},
        registrationDate: {
            type: String,
			default: Date.now
        },
        status : {
            type: Number,
            default: 1
        },
        resolutionDate : {
            type: String
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
