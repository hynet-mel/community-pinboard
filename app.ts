var createError = require('http-errors');
var express = require('express');
import { Request, Response, NextFunction } from "express";

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require("node-sass-middleware");

var getRouter = require('./app/routes.get');
var editRouter = require('./app/routes.edit');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sassMiddleware({
  src: path.join(__dirname, "styles"),
  dest: path.join(__dirname, "public", "stylesheets"),
  outputStyle: "compressed",
  prefix: "/stylesheets/"
}));

app.use('/', getRouter);
app.use('/', editRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: {status: number, message: string}, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
