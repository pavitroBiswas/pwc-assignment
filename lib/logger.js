// eslint-disable-next-line max-classes-per-file
const winston = require('winston');
require('winston-daily-rotate-file');
require('winston-mongodb');
const ip = require('ip');
const os = require('os');
const loggertypeenum = require('../enum/loggertype.enum');
// Log unhandled exceptions to separate file
const debugfilter = winston.format((info) =>
	(info.level === 'debug' ? info : false));
const infoFilter = winston.format((info) =>
	(info.level === 'info' || info.level === 'warn' ? info : false));
const errorFilter = winston.format((info) =>
	(info.level === 'error' ? info : false));

const filelogger = (APPLICATIONNAME) => {
	const exceptionHandlers = [
		new winston.transports.DailyRotateFile({
			name: 'exceptionlog',
			filename: `${APPLICATIONNAME}-exception-%DATE%.log`,
			level: 'error',
			handleExceptions: true,
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '1d',
			json: true,
			format: winston.format.combine(
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
	];

	// Separate warn/error
	const transports = [
		new winston.transports.DailyRotateFile({
			name: 'infolog',
			json: true,
			level: 'info',
			filename: `${APPLICATIONNAME}-info-%DATE%.log`,
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '1d',
			handleExceptions: false,
			format: winston.format.combine(
				infoFilter(),
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
		new winston.transports.DailyRotateFile({
			name: 'debuglog',
			json: true,
			level: 'debug',
			filename: `${APPLICATIONNAME}-debug-%DATE%.log`,
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '1d',
			handleExceptions: false,
			format: winston.format.combine(
				debugfilter(),
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
		new winston.transports.DailyRotateFile({
			name: 'errorlog',
			json: true,
			level: 'error',
			filename: `${APPLICATIONNAME}-error-%DATE%.log`,
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '1d',
			handleExceptions: false,
			format: winston.format.combine(
				errorFilter(),
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
	];
	return { exceptionHandlers, transports };
};

const mongologger = (LOGGERCONNECTIONSTRING, APPLICATIONNAME) => {
	const exceptionHandlers = [
		new winston.transports.MongoDB({
			db: LOGGERCONNECTIONSTRING,
			name: 'exceptionlog',
			indexPrefix: `${APPLICATIONNAME}-exception`,
			level: 'error',
			collection: 'exceptionlog',
			capped: true,
			tryReconnect: true,
			storeHost: true,
			leaveConnectionOpen: false,
			handleExceptions: true,
			json: true,
			format: winston.format.combine(
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
	];

	// Separate warn/error
	const transports = [
		new winston.transports.MongoDB({
			db: LOGGERCONNECTIONSTRING,
			name: 'infolog',
			indexPrefix: `${APPLICATIONNAME}-info`,
			level: 'info',
			collection: 'infolog',
			capped: true,
			tryReconnect: true,
			storeHost: true,
			leaveConnectionOpen: false,
			json: true,
			handleExceptions: false,
			format: winston.format.combine(
				infoFilter(),
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
		new winston.transports.MongoDB({
			db: LOGGERCONNECTIONSTRING,
			name: 'debuglog',
			indexPrefix: `${APPLICATIONNAME}-debug`,
			level: 'debug',
			collection: 'debuglog',
			capped: true,
			tryReconnect: true,
			storeHost: true,
			leaveConnectionOpen: false,
			json: true,
			handleExceptions: false,
			format: winston.format.combine(
				debugfilter(),
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
		new winston.transports.MongoDB({
			db: LOGGERCONNECTIONSTRING,
			name: 'errorlog',
			indexPrefix: `${APPLICATIONNAME}-error`,
			level: 'error',
			collection: 'errorlog',
			capped: true,
			tryReconnect: true,
			storeHost: true,
			leaveConnectionOpen: false,
			json: true,
			handleExceptions: false,
			format: winston.format.combine(
				errorFilter(),
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		}),
	];
	return { exceptionHandlers, transports };
};

class loggerinstance {
	constructor() {
		const {
			LOGGERCONNECTIONSTRING,
			SERVERIP,
			SERVERNAME,
			APPLICATIONNAME,
			LOGGERTYPE,
			SUBDOMAIN,
		} = process.env;
		// Log unhandled exceptions to separate file
		let loggerconfig = {};
		switch (parseInt(LOGGERTYPE || '-1', 10)) {
			case loggertypeenum.MONGODB:
				loggerconfig = mongologger(LOGGERCONNECTIONSTRING, APPLICATIONNAME);
				break;
			case loggertypeenum.FILE:
			default:
				loggerconfig = filelogger(APPLICATIONNAME);
				break;
		}
		this.logger = winston.createLogger({
			...loggerconfig,
			exitOnError: false,
			defaultMeta: {
				application: APPLICATIONNAME,
				hostname: os.hostname(),
				serveripaddress: SERVERIP,
				serverhostname: SERVERNAME,
				ipaddress: ip.address(),
				subdomain: SUBDOMAIN,
			},
			format: winston.format.combine(
				winston.format.json(),
				winston.format.timestamp(),
				winston.format.errors({
					stack: true,
				}),
				winston.format.metadata(), /* add this line if you dont have it */
			),
		});
	}
}
class logger {
	constructor() {
		throw new Error('Use logger.getlogger()');
	}

	static getlogger() {
		if (!logger.instance) {
			logger.instance = new loggerinstance();
		}
		return logger.instance.logger;
	}
}
module.exports = logger;
