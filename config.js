const dotenv = require('dotenv');

dotenv.config();
const error = (errorMessage) => {
	throw Error(errorMessage);
};
const {
	DATASTOREPORT,
    MONGOCONNECTIONSTRING,
    DEBUGENABLED,
    ENABLEHTTPS,
    LOGGERCONNECTIONSTRING,
    APPLICATIONSECRET,
    JWTSECRET,
    REFRESHJWTSECRET

} = process.env;

const config = {
	DATASTOREPORT,
    MONGOCONNECTIONSTRING,
    LOGGERCONNECTIONSTRING,
    JWTSECRET,
    REFRESHJWTSECRET,
    DEBUGENABLED: DEBUGENABLED || false,
    ENABLEHTTPS: ENABLEHTTPS || false,
    APPLICATIONSECRET: APPLICATIONSECRET || error('Missing APPLICATIONSECRET'),
};

module.exports = config;
