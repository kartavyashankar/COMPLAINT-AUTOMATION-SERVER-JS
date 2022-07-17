const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const app_prop = require("../res/app-properties");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Complaint Management API",
      description: "API for managing complaints for the use of frontend",
      version: "1.0.0",
      contact: {
        name: "Anshul Pandey",
        email: "anshulpandey275@gmail.com",
      },
      servers: ["http://localhost:8080"],
    },
  },
  apis: [`${__dirname}/controller/routes/*.js`, `${__dirname}/models/*.js`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(cors());

app.use(express.json());

const userRoute = require("./controller/routes/userRoute");
const complaintRoute = require("./controller/routes/complaintRoute");

app.use("/user", userRoute);
app.use("/user/complaint", complaintRoute);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get("/healthcheck", (req, res) => {
  res.status(200).send("UP");
});

app.get("/", (req, res) => {
  res.status(302).redirect("/api-docs");
});

mongoose
  .connect(app_prop.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB!"));

const PORT = app_prop.PORT;
const server = app.listen(process.env.PORT || PORT, () =>
  console.log(`\nServer running on port ${PORT}`)
);

module.exports = server;
