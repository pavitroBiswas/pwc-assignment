const Cryptr = require('cryptr');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ms = require('ms');
const log = require('../lib/logger').getlogger();
const config = require('../config');
const {
	JWTSECRET,
	REFRESHJWTSECRET,
	APPLICATIONSECRET,
} = require('../config');

const {
	userbusiness
} = require('../business');

const cryptr = new Cryptr(APPLICATIONSECRET);
const uservalidation = require('../lib/validation/user.validation');

try {
	const generatetokens = (user) => {
		const accesstoken = jwt.sign(
			{
				id: user.id,
				empid: user.empid,
				email: user.email,
			},
			JWTSECRET,
			{
				expiresIn: ms('5m'),
			}
		);

		const refreshtoken = jwt.sign(
			{
				id: user.id,
				empid: user.empid,
				email: user.useremail
			},
			REFRESHJWTSECRET,
			{
				expiresIn: ms('5m'),
			}
		);

		return {
			accessToken: accesstoken,
			refreshToken: refreshtoken,
		};
	};
	exports.signup = async (req, res) => {
		try {
			if (!uservalidation.validateuser(req.body.email)) {
				return res.status(400).send({
					data: 'invalid email',
					error: true,
				});
			}
			if (
				!(await uservalidation.validateuserexists(
					req.body.email
				))
			) {
				return res.status(400).send({
					data: 'email exists',
					error: true,
				});
			}
			if (!uservalidation.validatepassword(req.body.passwordhash)) {
				return res.status(400).send({
					data:
						'invalid password, Required : Minimum length 8, Maximum length 100, Must have at least 1 uppercase letter, Must have at least 1 lowercase letter, Must have at least 1 digits, Should not have spaces',
					error: true,
				});
			}
			await userbusiness.usersave(
				req.body
			);
			return res.send({
				data: 'user registered successfully!',
			});
		} catch (e) {
			log.error(e);
			return res.status(500).send({
				data: e.toString(),
				exception: true,
			});
		}
	};

	exports.signin = async (req, res) => {
		try {
			const user = await userbusiness.userfindbyemail(
				req.body.email
			);
			if (!user) {
				return res.status(401).send({
					data: 'Invalid username / password',
					error: true,
				});
			}
			const passwordIsValid = bcrypt.compareSync(
				req.body.passwordhash,
				user.passwordhash
			);
			if (!passwordIsValid) {
				return res.status(401).send({
					data: 'invalid username / password',
					error: true,
				});
			}
			const tokens = generatetokens(user);
			return res.status(200).send({
				data: tokens,
			});
		} catch (e) {
			log.error(e);
			return res.status(500).send({
				data: e.toString(),
				exception: true,
			});
		}
	};

} catch (e) {
	log.error(e);
}
