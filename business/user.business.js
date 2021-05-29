const bcrypt = require('bcryptjs');
const voca = require('voca');
const { v4: uuid4 } = require('uuid');
const user = require('../model/employee.model');
const log = require('../lib/logger').getlogger();

try {
	module.exports = {
        // employee user save
		usersave: (payloads) => {

			return user.create({
				email: payloads.email,
				passwordhash: bcrypt.hashSync(
					voca.trim(payloads.passwordhash),
					8
				),
				firstname: payloads.firstname,
                middlename:payloads.middlename,
				lastname: payloads.lastname,
				dateofbirth: new Date(payloads.dateofbirth),
                mobileno: payloads.mobileno,
				empid: uuid4(),
			});
		},
        // get employee use by email id
		userfindbyemail: (email) => user.findOne({
				email: voca.lowerCase(voca.trim(email)),
			}),
	};
} catch (e) {
	log.error(e);
}
