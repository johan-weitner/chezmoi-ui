import winston from "winston";

export const log = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	defaultMeta: { service: "user-service" },
	transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

export const dbLog = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	defaultMeta: { service: "db-service" },
	transports: [
		new winston.transports.File({ filename: "db-error.log", level: "error" }),
		new winston.transports.File({ filename: "db.log" }),
	],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
	log.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	);
}
