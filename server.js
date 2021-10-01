
const express = require('express');
const http = require("http");
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
/* const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("./src/server/passport/setup"); */
var bodyParser = require('body-parser');
const socketIo = require("socket.io");
const route = require('./route');
const EventEmitter = require('events');
const jwt = require('jsonwebtoken');


const myEmitter = new EventEmitter();
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 5000;
const io = socketIo(httpServer, {
  cors: true,
  origins: [`http://locahost:${port}}`]
})
////
/* 
const MONGO_URI = "mongodb://127.0.0.1:27017/tutorial_social_login"; */
const cors = require('cors')
app.use(cors());
app.use(bodyParser.json());

// add middlewares
const root = require('path').join(__dirname, 'build');
app.use(express.static(root));

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
/* mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(console.log(`MongoDB connected ${MONGO_URI}`))
  .catch(err => console.log(err)); */
// Bodyparser middleware, extended false does not allow nested payloads
/* app.use(express.json());
app.use(express.urlencoded({ extended: false })); */
// Express Session
app.use(
  session({
    secret: "very secret this is",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express());
//app.use(express.static('build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/route', route)
app.set('event', myEmitter) // Attach the event emitter to use on routes
const connections = []

let interval;


io
  .on('connection', function (socket) {
    // Connection now authenticated to receive further events
    console.log('hi')
    socket.on('notify', function (data) {
      console.log(data)
      socket.emit('message', data);
    });
    socket.on('authenticate', function (data) {
      console.log(data)
      const token = data.token;
      if (token) {
        jwt.verify(token, process.env.JWT, [algorithm = "HS256"], (err, user) => {
          if (err) {
            console.log(err)
            //return res.sendStatus(403);
          }
          else {
            console.log("emit")
            socket.emit('authenticated', { done: 'Done', data: data });
          }
        });

      }

    });
  });


// Socket.io emit generator on an EventEmitter listener
myEmitter.on('my-event', (data) => {
  connections.forEach((socket) => {
    console.log(data)
    socket.emit('notify', data)
  })
})

/* const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", route.authenticateJWT);
}; */

//app.listen(port, () => console.log(`Listening on port ${port}`));
httpServer.listen(port, () => console.log(`App listening on port ${port}.`))

