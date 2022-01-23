
const express = require('express');
const http = require("http");
const cookieParser = require('cookie-parser');
const session = require("express-session");
/* const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("./src/server/passport/setup"); */
var bodyParser = require('body-parser');
const socketIo = require("socket.io");
const EventEmitter = require('events');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var siofu = require("socketio-file-upload");
const cors = require('cors')

const myEmitter = new EventEmitter();
const app = express();

////
/* 
const MONGO_URI = "mongodb://127.0.0.1:27017/tutorial_social_login"; */

app.use(cors());
/* mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(console.log(`MongoDB connected ${MONGO_URI}`))
  .catch(err => console.log(err)); */
// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Express Session
app.use(
  session({
    secret: "very secret this is",
    resave: false,
    saveUninitialized: true,
  })
);
//app.use(express.static('public'))
app.use('/public', express.static(path.join(__dirname, "public")));
app.use(express.static('build'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(siofu.router);

app.get('/img', function (req, res) {
  try {
    var full_path = "src/util/White-square.jpg"

    fs.exists(full_path, function (exists) {
      if (!exists) {
        res.redirect("/");
      } else {
        fs.readFile(full_path, "binary", function (err, file) {
          res.writeHeader(200);
          res.write(file, "binary");
          res.end();
        });
        console.log(res)
      }
    });
  } catch (err) {
    res.render('500.jade', {});
  }
});
app.set('event', myEmitter) // Attach the event emitter to use on routes



/* const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", route.authenticateJWT);
}; */

//app.listen(port, () => console.log(`Listening on port ${port}`));


