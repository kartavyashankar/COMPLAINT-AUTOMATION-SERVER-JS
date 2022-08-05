const mongoose = require("mongoose");

/**
 * @swagger
 *  components:
 *   schemas:
 *    Complaint:
 *     type: object
 *     required:
 *      - name
 *      - forceNumber
 *      - quarterNumber
 *      - category
 *      - complaint
 *     properties:
 *      complaintNumber:
 *       type: Number
 *       description: Complaint Number
 *      name:
 *       type: String
 *       description: Name of the complaint raiser
 *      forceNumber:
 *       type: String
 *       description: Force Number of the complaint raiser
 *      quarterNumber:
 *       type: Number
 *       description: Quarter Number of complaint
 *      category:
 *       type: String
 *       description: Category of Complaint
 *      complaint:
 *       type: String 
 *       description: Description of the complaint
 *      registrationDate:
 *       type: Date
 *       description: Date when complaint is registered
 *      status:
 *       type: Number
 *       description: Status of the complaint
 *      resolutionDate:
 *       type: Date
 *       description: Date of resolution of complaint
 */

const complaintSchema = mongoose.Schema(
	{
		complaintNumber: {
            unique: true,
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
        },
        assignedTo: {
            type: String
        },
        closedBy: {
            type: String
        }
	},
	{ versionKey: false }
);

module.exports = mongoose.model("complaints", complaintSchema);