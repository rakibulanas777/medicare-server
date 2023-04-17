const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		catagory: {
			type: String,
			required: [true, "Please provide your name"],
		},
		desc: {
			type: String,
		},
		location: {
			type: String,
			required: [true, "Please provide your location"],
		},
		price: {
			type: Number,
			required: [true, "Please provide your price"],
		},
		slots: {
			type: Array,
			required: [true, "Please provide your name"],
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Doctor", DoctorSchema);
