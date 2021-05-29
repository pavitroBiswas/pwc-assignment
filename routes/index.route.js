var express = require('express');
var router = express.Router();
const log = require('../lib/logger').getlogger();

try {
  
  /**
	 * @typedef response
	 * @property {object} data
	 * @property {boolean} error
	 * @property {boolean} exception
	 *
	 */

 	/**
	 * Authentication - Example
	 * @route GET /api/authentication
	 * @group Authentication with Token Access
	 * @produces application/json application/xml
	 * @consumes application/json application/xml
	 * @returns {response.model} 200 - {"data": true}
	 * @returns {response.model} 400 - Bad request
	 * @returns {response.model} 401 - Unauthorized
	 * @returns {response.model} 403 - Forbidden
	 * @returns {response.model} 500 - Server Error
	 * @security JWT
	 */
/* GET home page. */
router.get('/authentication', function(req, res, next) {
  res.status(200).json({data:'Authentication successfully'})
});
module.exports = router;
} catch (e) {
  log.error(e);
}

