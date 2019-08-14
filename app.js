const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Use CORS and File Upload modules here
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let users = [];

app.get('/home', function(req, res) {
  console.log('Inside Home Login');
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  console.log('Users : ', JSON.stringify(users));
  res.end(JSON.stringify(users));
});

app.post('/user/signup', function(req, res) {
  const newUser = {
    UserFirstName: req.body.firstName,
    UserLastName: req.body.lastName,
    UserEmail: req.body.email,
    UserPassword1: req.body.password1,
    UserPassword2: req.body.password2,
    UserPostCode: req.body.postCode
  };

  users.push(newUser);
  console.log(users);
});

//start your server on port 3001
app.listen(3001, () => {
  console.log('Server Listening on port 3001');
});

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
