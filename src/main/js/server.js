const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const app_prop = require("../res/app-properties")

app.use(cors());

app.use(express.json());

// Routes
//const postsRoute = require("./routes/posts");

// Middlewares
//app.use("/api/v1.0", authRoute);

// CONNECT TO DB
mongoose.connect(
	app_prop.DB_CONNECT,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	() => console.log("Connected to DB!")
);

const PORT = app_prop.PORT;
app.listen(PORT, () => console.log(`\nServer running on port ${PORT}`));