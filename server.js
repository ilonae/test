const express = require('express');
const request = require('request-promise');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const passport = require("./src/server/passport/setup");
const auth = require("./src/server/routes/auth");

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/tutorial_social_login";


mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(console.log(`MongoDB connected ${MONGO_URI}`))
  .catch(err => console.log(err));

// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "very secret this is",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use("/", auth);
app.post('/api/png_array', (req, res) => {
  const optionsFilter = {
    method: req.method,
    uri: 'http://titan:5050/png_array',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(optionsFilter)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/global_analysis', (req, res) => {
  const optionsFilter = {
    method: req.method,
    uri: 'http://titan:5050/global_analysis',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(optionsFilter)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/heatmap_single_filter', (req, res) => {
  const optionsFilter = {
    method: req.method,
    uri: 'http://titan:5050/heatmap_single_filter',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(optionsFilter)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/attribution_graph', (req, res) => {
  const options = {
    method: req.method,
    uri: 'http://titan:5050/attribution_graph',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/get_image', (req, res) => {
  const options = {
    method: req.method,
    uri: 'http://titan:5050/select_image',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});
app.post('/api/local_analysis', (req, res) => {
  const options = {
    method: req.method,
    uri: 'http://titan:5050/local_analysis',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/get_XAI_available', (req, res) => {
  const options = {
    method: req.method,
    uri: 'http://titan:5050/get_XAI_available',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/watershed', (req, res) => {
  const options = {
    method: req.method,
    uri: 'http://titan:5050/get_masks',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/api/get_heatmap', async (req, res) => {
  const options = {
    method: req.method,
    uri: 'http://titan:5050/calc_heatmap',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  request(options)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
