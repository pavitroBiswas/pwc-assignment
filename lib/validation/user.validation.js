const voca = require('voca');
const lodash = require('lodash');
const is = require('is_js');
const passwordValidator = require('password-validator');
const log = require('../logger').getlogger();
const { userbusiness } = require('../../business');

try {
	module.exports = {
        validateuser: (email) => {
			const emailtemp = voca.trim(email);
			return is.email(emailtemp);
		},
        validateuserexists: async (email) => {
			const emailtemp = voca.trim(email);
			const tempuser = await userbusiness.userfindbyemail(
				emailtemp
			);
			return tempuser === null || tempuser === undefined;
		},
		validatepassword: (password) => {
			const passwordschema = new passwordValidator();
			passwordschema
				.is()
				.min(8) // Minimum length 8
				.is()
				.max(100) // Maximum length 100
				.has()
				.uppercase(1) // Must have uppercase letters
				.has()
				.lowercase(1) // Must have lowercase letters
				.has()
				.digits(1) // Must have at least 2 digits
				.has()
				.not()
				.spaces(); // Should not have spaces
			return passwordschema.validate(password);
		},
	};
} catch (e) {
	log.error(e);
}
