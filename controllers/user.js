const bcrypt = require("bcrypt");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res, next) => {
	// const salt = bcrypt.genSaltSync(10);
	// const hash = bcrypt.hashSync(req.body.password, salt);
	// const hashConfrim = bcrypt.hashSync(req.body.passwordConfrim, salt);

	const newUser = new User(
		req.body
		// password: hash,
		// passwordConfrim: hashConfrim,
	);
	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: "5h",
	});
	await newUser.save();
	res.status(200).json({
		status: "sucess",
		token,
		data: {
			user: newUser,
		},
	});

	next();
});

const getUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();
	if (req.query.email) {
		const search = req.query.email;
		const matched = users.filter((user) => user.email.includes(search));
		res.status(200).json(matched);
	} else {
		res.status(200).json(users);
	}
	next();
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("please provide a email and password", 400));
	}
	//check user is exit or not
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email or password", 401));
	}
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "5h",
	});
	res.status(200).json({
		status: "sucess",
		token,
		data: {
			user,
		},
	});
	next();
});
const protect = catchAsync(async (req, res, next) => {
	let token;

	token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return next(
			new AppError("You are not logged in ! Please log in to get access", 401)
		);
	}

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	console.log(decoded);
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(
			new AppError(
				"The user belonging to this token does no longer exist.",
				401
			)
		);
	}
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError("User recently changed password! Please log in again.", 401)
		);
	}
	req.user = currentUser;
	next();
});

module.exports = { getUsers, login, register, protect };
