const express = require("express");
const app = express();
const statsRoute = require("./Routes/statsRoute");
const dotenv = require("dotenv");
const errorController = require("./Controller/errorController");

dotenv.config({ path: "./config.env" });

app.use(errorController);

// Routes
app.use("/api/v1/", statsRoute);

app.use(errorController);
module.exports = app;
