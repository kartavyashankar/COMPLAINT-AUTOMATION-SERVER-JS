const Joi = require("@hapi/joi");

const userRegisterValidation = (data) => {
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

const workerRegisterValidation = (data) => {
	const validSchema = Joi.object({
		name: Joi.string().required(),
		forceNumber: Joi.string().required(),
		password: Joi.string().min(6).required(),
		unit: Joi.string().required(),
		category: Joi.string().required(),
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
		category: Joi.string().required(),
		complaint: Joi.string().required()
	});
	return validSchema.validate(data);
};

const authComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber : Joi.number().positive().required(),
	});
	return validSchema.validate(data);
};

const rejectComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber : Joi.number().positive().required(),
	});
	return validSchema.validate(data);
};

const resolveComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber: Joi.number().positive().required()
	});
	return validSchema.validate(data);
};

const deleteComplaint = (data) => {
	const validSchema = Joi.object({
		complaintNumber: Joi.number().positive().required()
	});
	return validSchema.validate(data);
};

const deleteUserOrWorker = (data) => {
	const validSchema = Joi.object({
		forceNumber: Joi.string().required()
	});
	return validSchema.validate(data);
};

module.exports = {
	userRegisterValidation: userRegisterValidation,
    loginValidation: loginValidation,
	postComplaint: postComplaint,
	authComplaint: authComplaint,
	rejectComplaint: rejectComplaint,
	resolveComplaint: resolveComplaint,
	workerRegisterValidation: workerRegisterValidation, 
	deleteComplaint: deleteComplaint,
	deleteUserOrWorker: deleteUserOrWorker
};