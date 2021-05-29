const mongoose = require('mongoose');
const log = require('./logger').getlogger();
const { MONGOCONNECTIONSTRING, DEBUGENABLED } = require('../config');

try {
	module.exports = {
		connect: () => {
			const option = {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
			};
			mongoose.connect(MONGOCONNECTIONSTRING, option);

			if (JSON.parse(DEBUGENABLED)) {
				mongoose.set('debug', true);
			}

			mongoose.connection.on('connected', () => {
				log.info(
					'Mongoose default connection is open to ',
					MONGOCONNECTIONSTRING
				);
			});

			mongoose.connection.on('error', (err) => {
				log.error(`Mongoose default connection has occured ${err} error`);
			});

			mongoose.connection.on('disconnected', () => {
				log.info('Mongoose default connection is disconnected');
			});

			process.on('SIGINT', () => {
				mongoose.connection.close(() => {
					log.info(
						'Mongoose default connection is disconnected due to application termination'
					);
					process.exit(0);
				});
			});
		},
	};
} catch (e) {
	log.error(e);
}
