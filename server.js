const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/api/get_heatmap_filter', (req, res) => {
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
