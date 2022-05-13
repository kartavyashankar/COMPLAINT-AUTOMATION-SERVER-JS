const Joi = require("@hapi/joi");

const loginValidation = (data) => {
	const validSchema = Joi.object({
		forceNumber: Joi.number().positive().required(),
		password: Joi.string.required()
	});
	return validSchema.validate(data);
};

const postComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber: Joi.number().positive().required(),
		forceNumber: Joi.number().positive().required(),
		quarterNumber: Joi.number().positive().required(),
		category: Joi.number().positive().required(),
		complaint: Joi.string().required()
	});
	validSchema.validate(data);
};

// reset status from cancelled to Pending for review
const updateComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber: Joi.number().positive().required(),
		complaint: Joi.string().required()
	});
	validSchema.validate(data);
};

const updateComplaintStatus = (data) => {
	const validSchema = Joi.object({
		status: Joi.number.required()
	});
	return validSchema.validate(data);
};

const updateFeedback = (data) => {
	const validSchema = Joi.object({
		feedbackRating: Joi.number().greater(-1).less(6).required()
	});
	return validSchema.validate(data);
};

module.exports({
    loginValidation: loginValidation,
	postComplaint: postComplaint,
	updateComplaint: updateComplaint,
	updateComplaintStatus: updateComplaintStatus,
	updateFeedback: updateFeedback
});