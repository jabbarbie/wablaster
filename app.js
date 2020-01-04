var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// Inisisialisasi - Controller
var indexRouter = require('./routes/index');
var penerimaRouter = require('./routes/penerima');
var robotRouter = require('./routes/robot')
var pengaturanRouter = require('./routes/pengaturan') 

// keperluan upload file
const fileupload 	= require('express-fileupload')
app.use(fileupload({
	debug: true
}))

// handle request - post
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Controller
app.use('/', indexRouter);
app.use('/penerima', penerimaRouter);
app.use('/robot', robotRouter);
app.use('/pengaturan', pengaturanRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
