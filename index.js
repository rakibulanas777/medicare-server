const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/users");
const doctorRoute = require("./routes/doctor");
const cors = require("cors");
const port = process.env.PORT || 8000;
const app = express();
dotenv.config();

app.use(cors());
app.get("/", (req, res) => {
	res.send("Hello world ");
});

//connect with database
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB);
		console.log("Connected");
	} catch (error) {
		throw error;
	}
};

mongoose.connection.on("disconnected", () => {
	console.log("disconnected");
});
mongoose.connection.on("connected", () => {
	console.log("connected");
});

//middlewares
app.use(express.json());

app.use("/users", userRoute);
app.use("/doctors", doctorRoute);

app.listen(port, () => {
	connect();
	console.log(`LIstening on port ${port}`);
});
