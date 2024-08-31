// server will just be for storing what is currently in local storage to preserve details across versions
// can supply just a username, or also a password
// endpoints:
// login
// getUserDetails
// logout
// updateUserDetails

// will want a debouncing mechanism for updating the server so it doesn't get spammed

const express = require('express');
const session = require('express-session');
const { login } = require('./endpoints/login');
const { logout } = require('./endpoints/logout');
const { register } = require('./endpoints/register');
const { updateUserDetails } = require('./endpoints/updateUserDetails');
const { getUserDetails } = require('./endpoints/getUserDetails');
var app = express();

var sess = {
    secret: 'osltl sec 1423',
    cookie: {}
}
  
  if (app.get('env') === 'production') {
    sess.cookie.secure = true // serve secure cookies
  }
  
app.use(session(sess))

app.post('/login', login);

app.post('/logout', logout);

app.post('/register', register);

app.put('/updateUserDetails', updateUserDetails);

app.get('/getUserDetails', getUserDetails);