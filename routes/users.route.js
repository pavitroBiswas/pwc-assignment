var express = require('express');
var router = express.Router();
const log = require('../lib/logger').getlogger();
const controller = require('../controllers/user.controller')

try {
  
  /**
	 * @typedef response
	 * @property {object} data
	 * @property {boolean} error
	 * @property {boolean} exception
	 *
	 */

  /**
	 * @typedef Signup
   * @property {string} firstname
   * @property {string} middlename
   * @property {string} lastname
	 * @property {string} email
	 * @property {string} passwordhash
	 * @property {string} firstname
	 * @property {string} lastname
	 * @property {string} dateofbirth
	 * @property {number} mobileno
	 *
	 */

   /**
	 * @typedef Signin
   * @property {string} email
   * @property {string} passwordhash
	 *
	 */
  /**
	 * Signup - Create new user
	 * @route POST /api/signup
	 * @group Employee Create
	 * @param {Signup.model} body.body.required
	 * @produces application/json application/xml
	 * @consumes application/json application/xml
	 * @returns {response.model} 200 - {"data": "user registered successfully!"}
	 * @returns {response.model} 400 - Bad request
	 * @returns {response.model} 500 - Server Error
	 */
  /* POST users. */
  router.post('/signup', controller.signup);

   /**
	 * Signin - Login user
	 * @route POST /api/signin
	 * @group Employee Token
	 * @param {Signin.model} body.body.required
	 * @produces application/json application/xml
	 * @consumes application/json application/xml
	 * @returns {response.model} 200 - {"data": "user registered successfully!"}
	 * @returns {response.model} 400 - Bad request
	 * @returns {response.model} 500 - Server Error
	 */
  /* POST users login. */
  router.post('/signin', controller.signin);

module.exports = router;
} catch (e) {
	log.error(e);
}

