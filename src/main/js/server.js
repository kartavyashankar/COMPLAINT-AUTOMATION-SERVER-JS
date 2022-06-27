const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const app_prop = require("../res/app-properties");
const swaggerUI = require("swagger-ui-express");
const docs = require("./docs");

app.use(cors());

app.use(express.json());

const userRoute = require("./controller/routes/userRoute");
const complaintRoute = require("./controller/routes/complaintRoute");

app.use("/user", userRoute);
app.use("/user/complaint", complaintRoute);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

mongoose.connect(
	app_prop.DB_CONNECT,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
).then(() => console.log("Connected to DB!"));

const PORT = app_prop.PORT;
app.listen(process.env.PORT || PORT, () => console.log(`\nServer running on port ${PORT}`));