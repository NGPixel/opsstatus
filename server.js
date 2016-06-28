// ===========================================
// OPS STATUS
// 1.0.0
// Licensed under GPLv3
// ===========================================

// ----------------------------------------
// Load modules
// ----------------------------------------

global.winston = require('winston');
winston.log('Ops Status is initializing...');

var appconfig = require('./config.json');
global.db = require('modules/db')(appconfig);
global.red = require('modules/redis')(appconfig);

var _ = require('lodash');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var compression = require('compression');
var passport = require('passport');
var autoload = require('auto-load');
var expressValidator = require('express-validator');

global.lang = require('i18next');
var i18next_backend = require('i18next-node-fs-backend');
var i18next_mw = require('i18next-express-middleware');

var ctrl = autoload(path.join(__dirname, '/controllers'));

// ----------------------------------------
// Define Express App
// ----------------------------------------

global.app = express();
global.ROOTPATH = __dirname;

// ----------------------------------------
// Security
// ----------------------------------------

app.use(mw.security);

// ----------------------------------------
// Passport Authentication
// ----------------------------------------

var strategy = require('./passport-auth0');

app.use(cookieParser());
app.use(session({
  name: 'opsstatus.sid',
  store: new redisStore({ client: red }),
  secret: appconfig.sessionSecret,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// ----------------------------------------
// Localization Engine
// ----------------------------------------

lang
  .use(i18next_backend)
  .use(i18next_mw.LanguageDetector)
  .init({
    load: 'languageOnly',
    ns: ['common'],
    defaultNS: 'common',
    saveMissing: false,
    supportedLngs: ['en', 'fr'],
    preload: ['en', 'fr'],
    fallbackLng : 'en',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  });

// ----------------------------------------
// View Engine Setup
// ----------------------------------------

app.use(compression());

app.use(i18next_mw.handle(lang));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// ----------------------------------------
// Public Assets
// ----------------------------------------

app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------
// View accessible data
// ----------------------------------------

app.locals._ = require('lodash');
app.locals.appconfig = appconfig;
app.locals.appdata = require('./data.json');
app.use(mw.flash);

// ----------------------------------------
// Controllers
// ----------------------------------------

app.use('/', ctrl.login);

app.use('/', mw.auth, ctrl.dashboard);
app.use('/admin', mw.auth, ctrl.create);

// ----------------------------------------
// Error handling
// ----------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: _isDebug ? err : {}
  });
});

winston.log('Ops Status has initialized successfully. [RUNNING]');