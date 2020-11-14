const winston = require("winston");
const morgan = require("morgan");

const loggerTransports = [];

const isProduction = process.env.APP_ENV === "production";

const expressFormat = isProduction ? "combined" : "dev";

loggerTransports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple()
    ),
    level: isProduction ? "error" : "info",
  })
);

const logger = winston.createLogger({ transports: loggerTransports });

const stream = {
  write(message) {
    logger.info(message);
  },
};

const expressLogger = () => morgan(expressFormat, { stream });

module.exports = {
  logger,
  expressLogger,
};
