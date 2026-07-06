const util = require("util");
const winston = require("winston");

const isProd = process.env.NODE_ENV === "production";

// JSON in production so log aggregators (CloudWatch/ELK/etc.) can parse fields;
// colorized single-line text in development for readability in a terminal.
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: isProd
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
      ),
  transports: [new winston.transports.Console()],
});

// Preserves the console.log-style call signature (message, ...extra) that
// existing call sites already use, instead of forcing every caller to switch
// to winston's (message, meta-object) convention.
const format = (msg, args) => (args.length ? util.format(msg, ...args) : msg);

const logger = {
  info: (msg, ...args) => winstonLogger.info(format(msg, args)),
  error: (msg, ...args) => winstonLogger.error(format(msg, args)),
  warn: (msg, ...args) => winstonLogger.warn(format(msg, args)),
  debug: (msg, ...args) => winstonLogger.debug(format(msg, args)),
};

module.exports = logger;
