const mongoose = require("mongoose");

/**
 * @swagger
 *  components:
 *   schemas:
 *    User:
 *     type: object
 *     required:
 *      - name
 *      - forceNumber
 *      - quarterNumber
 *      - password
 *      - unit
 *      - designation
 *      - quarterType
 *     properties:
 *      name:
 *       type: String
 *       description: Name of the user
 *      forceNumber:
 *       type: String
 *       description: Force Number of the user
 *      quarterNumber:
 *       type: Number
 *       description: Quarter Number of user
 *      quarterType:
 *       type: Number
 *       description: Quarter Type of the User
 *      password:
 *       type: String 
 *       description: Password of the user
 *      unit:
 *       type: String
 *       description: Unit of the user
 *      designation:
 *       type: String
 *       description: Designation of the user
 */
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		forceNumber: {
			type: String,
			required: true
		},
        password: {
            type: String,
			min: 6,
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
        },
	},
	{ versionKey: false }
);

module.exports = mongoose.model("users", userSchema);