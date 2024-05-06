import { format, createLogger, transports } from "winston";
import fs from "fs";
import path from "path";

const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const logFormat = format.printf((info) => {
  if (info.stack && info.port && info.syscall && info.code && info.request) {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  }
  return `${info.timestamp} ${info.level}: ${info.stack || info.message}`;
});

const errorFormat = format((info) => {
  if (
    "stack" in info &&
    "port" in info &&
    "code" in info &&
    "request" in info &&
    "config" in info
  ) {
    const { config, parent, request, prev, next, errno, ...rest } = info;
    return rest;
  }

  if ("stack" in info && "parent" in info && "prev" in info && "next" in info) {
    const { parent, prev, next, ...rest } = info;
    return rest;
  }

  if ("stack" in info && "rawHttpClientData" in info) {
    const { rawHttpClientData, ...rest } = info;
    return rest;
  }
  return info;
});
const filterOnly = (level: string) =>
  // eslint-disable-next-line consistent-return
  format((info) => {
    if (info.level === level) {
      return info;
    }
    return false;
  })();

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
    // logFormat
  ),
  silent: process.env.NODE_ENV === "test",
  // format: format.errors({ stack: true }),
  // defaultMeta: { service: 'user-service'}
  exitOnError: false,
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      format: format.combine(errorFormat(), format.prettyPrint()),
    }),
    new transports.File({
      filename: path.join(logDir, "error.log"),
      format: format.combine(errorFormat(), format.prettyPrint()),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDir, "info.log"),
      format: format.combine(filterOnly("info"), format.prettyPrint()),
      level: "info",
    }),
    new transports.File({
      handleExceptions: true,
      filename: path.join(logDir, "exceptions.log"),
      format: format.combine(
        filterOnly("error"),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errorFormat(),
        format.prettyPrint()
      ),
    }),
    new transports.File({
      handleRejections: true,
      filename: path.join(logDir, "rejections.log"),
      format: format.combine(
        filterOnly("error"),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errorFormat(),
        format.prettyPrint()
      ),
    }),
  ],
});

export default logger;
