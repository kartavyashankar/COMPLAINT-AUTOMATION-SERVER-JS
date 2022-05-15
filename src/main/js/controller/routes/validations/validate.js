const Joi = require("@hapi/joi");

const registerValidation = (data) => {
	const validSchema = Joi.object({
		name: Joi.string().required(),
		forceNumber: Joi.number().positive().required(),
		password: Joi.string().min(6).required(),
		unit: Joi.string().required(),
		designation: Joi.string().required(),
		quarterType: Joi.number().required(),
		quarterNumber: Joi.number().required()
	});
	return validSchema.validate(data);
};

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
	return validSchema.validate(data);
};

// reset status from cancelled to Pending for review
const updateComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber: Joi.number().positive().required(),
		complaint: Joi.string().required()
	});
	return validSchema.validate(data);
};

const updateComplaintStatus = (data) => {
	const validSchema = Joi.object({
		complaintNumber : Joi.number().positive().required(),
		status: Joi.number.required(),
		forceNumber: Joi.number().positive().required() 
	});
	return validSchema.validate(data);
};

const updateFeedback = (data) => {
	const validSchema = Joi.object({
		feedbackRating: Joi.number().greater(-1).less(6).required(),
		forceNumber: Joi.number().positive().required(),
		complaintNumber: Joi.number().positive().required()
	});
	return validSchema.validate(data);
};

const updateComplaintHandler = (data) => {
	const validSchema = Joi.object({
		forceNumber: Joi.number().positive().required(),
		complaintNumber: Joi.number().positive().required()
	});
	return validSchema.validate(data);
};

module.exports = {
	registerValidation: registerValidation,
    loginValidation: loginValidation,
	postComplaint: postComplaint,
	updateComplaint: updateComplaint,
	updateComplaintStatus: updateComplaintStatus,
	updateFeedback: updateFeedback,
	updateComplaintHandler: updateComplaintHandler
};