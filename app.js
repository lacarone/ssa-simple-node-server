// loading dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// loading routes
var indexRouter = require('./routes/index');
var apiRouter = require('./api/v1/routes');

// initializing the app
var app = express();

// adding middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adding routes
app.use('/', indexRouter);
app.use('/api/v1', apiRouter);

module.exports = app;