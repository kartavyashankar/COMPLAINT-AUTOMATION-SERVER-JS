const Joi = require("@hapi/joi");

const registerValidation = (data) => {
	const validSchema = Joi.object({
		name: Joi.string().required(),
		forceNumber: Joi.string().required(),
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
		forceNumber: Joi.string().required(),
		password: Joi.string().min(6).required()
	});
	return validSchema.validate(data);
};

const postComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber: Joi.number().positive().required(),
		forceNumber: Joi.string().required(),
		quarterNumber: Joi.number().positive().required(),
		category: Joi.number().positive().required(),
		complaint: Joi.string().required()
	});
	return validSchema.validate(data);
};

const getComplaint = (data) => {
	const validSchema = Joi.object({
		forceNumber: Joi.string().required()
	});
	return validSchema.validate(data);
};

const updateComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber: Joi.number().positive().required(),
		complaint: Joi.string().required(),
		forceNumber: Joi.string().required()
	});
	return validSchema.validate(data);
};

const fwd_auth_Complaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber : Joi.number().positive().required(),
		forceNumber: Joi.string().required() 
	});
	return validSchema.validate(data);
};

const rejectComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber : Joi.number().positive().required(),
		forceNumber: Joi.string().required(),
		reasonOfCancellation: Joi.string().required()
	});
	return validSchema.validate(data);
};

const updateFeedback = (data) => {
	const validSchema = Joi.object({
		feedbackRating: Joi.number().greater(-1).less(6).required(),
		forceNumber: Joi.string().required(),
		complaintNumber: Joi.number().positive().required()
	});
	return validSchema.validate(data);
};

module.exports = {
	registerValidation: registerValidation,
    loginValidation: loginValidation,
	postComplaint: postComplaint,
	getComplaint: getComplaint,
	updateComplaint: updateComplaint,
	fwd_auth_Complaint: fwd_auth_Complaint,
	rejectComplaint: rejectComplaint,
	updateFeedback: updateFeedback
};