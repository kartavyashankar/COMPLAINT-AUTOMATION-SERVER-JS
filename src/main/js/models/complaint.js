const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema(
	{
		complaintNumber: {
			type: Number
		},
        name: {
			type: String,
			required: true
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
        }
	},
	{ versionKey: false }
);

module.exports = mongoose.model("complaints", complaintSchema);
