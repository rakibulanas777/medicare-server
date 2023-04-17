const Doctor = require("../models/Doctors");
const catchAsync = require("../utils/catchAsync");

const addDoctor = catchAsync(async (req, res, next) => {
	const newDoctor = new Doctor(req.body);
	const saveDoctor = await newDoctor.save();

	res.status(200).json({
		saveDoctor,
	});
	next();
});

const getDoctor = catchAsync(async (req, res, next) => {
	const doctor = await Doctor.find().populate("user");
	if (req?.query.catagory || req.query.location) {
		const search = req.query?.catagory?.toLowerCase();
		const matched = doctor.filter((doctor) =>
			doctor.catagory.toLowerCase().includes(search)
		);
		const location = req.query.location.toLowerCase();
		const matchedLocation = matched.filter((doctor) =>
			doctor.location.toLowerCase().includes(location)
		);
		res.status(200).json({
			matchedLocation,
		});
	} else {
		res.status(200).json({
			doctor,
		});
	}
	next();
});

module.exports = {
	addDoctor,
	getDoctor,
};
