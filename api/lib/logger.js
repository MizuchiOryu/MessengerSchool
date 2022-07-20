const winston = require("winston");
require("winston-mongodb");

const { mongoose } = require("../schemas");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.MongoDB({
      db: mongoose.connection,
      collection: "logs",
    }),
  ],
});

if (process.env.NODE_ENV !== "prod") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
