var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var createStaff = require('./routes/createStaff')
var getStaffDetails = require('./routes/getStaffdetails')
var visitorstaff    = require('./routes/VisitoBook/VisitorStaff')
var visitorstudent = require('./routes/VisitoBook/VisitorStudent')
var getvisitorStudent = require('./routes/VisitoBook/getvisitorStudent')
var getvisitorStaff = require('./routes/VisitoBook/getvisitorStaff')
var deletevistorStaff = require('./routes/VisitoBook/deletevistorStaff')
var deletevistorStudent = require('./routes/VisitoBook/deletevisitorStudent')
var admissioncreate = require('./routes/admission/createadmission')
var admissionget = require('./routes/admission/admissionget')
var createcalllog = require('./routes/calllogs/createlogs')
var getcallogs = require('./routes/calllogs/getcalllogs')
var createdispatch =require('./routes/dispatch/craetedispatch')
var getdispatch = require('./routes/dispatch/getdispatch')
var createreceive = require('./routes/Postalreceive/postalreceive')
var getreceive = require('./routes/Postalreceive/getpostalreceive')
var createcomplain = require('./routes/Complain/craetecomplain')
var getcomlain = require('./routes/Complain/getcomplain')

var app = express();
app.use(cors());
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/createstaff', createStaff)
app.use('/getStaffDetails', getStaffDetails)
app.use('/visitorstaff', visitorstaff);
app.use('/visitorstudent', visitorstudent)
app.use('/getvisitorStudent', getvisitorStudent)
app.use('/getvisitorStaff', getvisitorStaff)
app.use('/deletevistorStaff', deletevistorStaff)
app.use('/deletevistorStudent', deletevistorStudent);
app.use('/admissioncraete', admissioncreate )
app.use('/getadmission', admissionget);
app.use('/createcalllogs', createcalllog)
app.use('/getcallogs', getcallogs)
app.use('/createdispatch', createdispatch)
app.use('/getdispatch',getdispatch)
app.use('/createreceive', createreceive)
app.use('/getreceive', getreceive)
app.use('/createcomplain', createcomplain)
app.use('/getcomlain',  getcomlain)


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
