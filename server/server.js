// server will just be for storing what is currently in local storage to preserve details across versions
// can supply just a username, or also a password
// endpoints:
// login
// getUserDetails
// logout
// updateUserDetails

// will want a debouncing mechanism for updating the server so it doesn't get spammed
require('./nodeenv');
const express = require('express');
const session = require('express-session');
const path = require("path");
const { login } = require('./endpoints/login');
const { logout } = require('./endpoints/logout');
const { register } = require('./endpoints/register');
const { updateUserDetails } = require('./endpoints/updateUserDetails');
const { getUserDetails } = require('./endpoints/getUserDetails');
const {logDebug} = require('./logger');
const bodyParser = require('body-parser');
const { loggedIn } = require('./endpoints/loggedIn');
const { SocketServer } = require('./socket');
const { createComp } = require('./endpoints/createComp');
const { getComp } = require('./endpoints/getComp');

const port = process.env.port || 8001;
const app = express();
const server = require('http').createServer(app);
const socketServer = new SocketServer(server);
const isProduction = app.get('env') === "production";

let sess;
if(isProduction){
  const redisStore = require('./redisStore');
  sess = {
    secret: 'osltl_sec_1423',
    cookie: {
      maxAge: 864000000
    },
    store: redisStore,
    resave: false,
    saveUninitialized: false,
  };
} else {
  sess = {
    secret: 'osltl_sec_1423',
    cookie: {},
  };
}

app.use(bodyParser.json())
app.use(session(sess))
app.use((req, res, next) => {
  logDebug(req.url);
  next();
})
const staticFolder = path.join(__dirname, '../dist');

app.use(express.static(staticFolder));
// app.use((req, res, next)=> {
//   try{next()}catch(err){
//     console.log(err.message);
//   }
// });
app.post('/login', login);

app.post('/logout', logout);

app.post('/register', register);

app.put('/updateUserDetails', updateUserDetails(socketServer));

app.get('/getUserDetails', getUserDetails);

app.get('/loggedIn', loggedIn);

// app.post('/comp', createComp);
// app.get('/comp', getComp);

server.listen(port, () =>{
  console.log("Server started listening on port " + port);
})