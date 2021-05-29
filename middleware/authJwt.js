const jwt = require('jsonwebtoken');
const _ = require('lodash');
const log = require('../lib/logger').getlogger();
const {userbusiness} = require('../business');
const { JWTSECRET } = require('../config');

try {
	module.exports = {
		validatetoken: async (req, res, next) => {
			if (!req) {
				return res.status(401).send({
					data: 'Unauthorized!',
					error: true,
				});
			}
			let tokendata = null;
			if (req.headers.authorization) {
				tokendata = req.headers.authorization;
                jwt.verify(tokendata, JWTSECRET, async (err, decoded) => {
					if (err) {
						return res.status(401).send({
							data: 'Unauthorized!',
							error: true,
						});
					}
					req.user = JSON.parse(
						JSON.stringify(
							await userbusiness.userfindbyemail(
								decoded.email
							)
						)
					);
					next();
				});
			} else {
				return res.status(401).send({
					data: 'No token provided!',
					error: true,
				});
			}
		},

	};
} catch (e) {
	log.error(e);
}
