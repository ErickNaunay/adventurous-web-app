const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const utils = require("./utils/logger");
const cors = require("cors");
require("dotenv").config()

require("./app-api/model/connection-manager");

//const indexRouter = require("./app_server/routes/index");
const apiRouter = require("./app-api/routes/index");

const app = express();
const PORT = process.env.APP_PORT || 3000;
const ENVIRONMENT = process.env.APP_ENV;

// view engine setup
app.set("views", path.join(__dirname, "./app_server/views"));
app.set("view engine", "pug");

app.use(utils.expressLogger());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// Error handling
const errorHandler = (err, req, res, next) => {
  if (process.env.APP_ENV === "dev") {
    logger.error(err.message);
    logger.error(err.stack || "");
  }

  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json(err);
};

app.use(errorHandler);

// eventually there will be more than one domain allowed
const allowedList = ["http://localhost:3000"];
const corsOptionsDelegate = function handler(req, callback) {
  const corsOptions = { origin: false };

  if (allowedList.indexOf(req.header("Origin") || "") !== -1) {
    corsOptions.origin = true;
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

//app.use("/", indexRouter);
//app.use("/api/v1", apiRouter);

app.get("/v1/status", (req, res) => {
  res.json({ time: new Date() });
});

app.use("/api/v1", apiRouter)

app.listen(PORT, () => {
  utils.logger.info(`Server listening on port %d, env: %s`, PORT, ENVIRONMENT);
});

module.exports = app;
