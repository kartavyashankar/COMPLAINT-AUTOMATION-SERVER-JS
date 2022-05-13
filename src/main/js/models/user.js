const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		forceNumber: {
			type: Number,
			required: true
		},
        password: {
            type: String,
            required: true
        },
		unit: {
			type: String,
			required: true
		},
        designation: {
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
        }
	},
	{ versionKey: false }
);

module.exports = mongoose.model("users", userSchema);
