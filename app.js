var createError = require('http-errors');
var express = require('express');
const expressSwaggerGenerator = require('express-swagger-generator');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dbengine = require('./lib/database-engine');
const log = require('./lib/logger').getlogger();
const {
	DATASTOREPORT,
  ENABLEHTTPS
} = require('./config');
const { version } = require('./package.json');
const authjwt = require('./middleware/authJwt');
var indexRouter = require('./routes/index.route');
var usersRouter = require('./routes/users.route');
try {
  var app = express();
const expressSwagger = expressSwaggerGenerator(app);
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
dbengine.connect();
const serverhttps = JSON.parse(ENABLEHTTPS);
const schemeshttpmethod = serverhttps ? 'https' : 'http';
const options = {
  swaggerDefinition: {
    info: {
      description: 'OneAPP Datastore API',
      title: 'Datastore API',
      version,
    },
    // host: `localhost:${DATASTOREPORT}`,
    basePath: '',
    produces: ['application/json', 'application/xml'],

    schemes: schemeshttpmethod,
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      },
    },
  },
  basedir: __dirname, // app absolute path
  files: ['./routes/**/*.js'], // Path to the API handle folder
};
expressSwagger(options);

// public access api
app.use('/api', usersRouter);
// private access api
app.use('/api', [authjwt.validatetoken],indexRouter);

app.listen(DATASTOREPORT, () => {
  // eslint-disable-next-line no-console
  console.log(`DataStore is running on port ${DATASTOREPORT}`);
});

module.exports = app;
} catch (e) {
  log.error(e);
}


