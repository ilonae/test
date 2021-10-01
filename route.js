const express = require('express');
const path = require('path');
const request = require('request-promise');
const jwt = require('jsonwebtoken');

const route = express.Router();

let status;

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT, [algorithm = "HS256"], (err, user) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403);
            }
            status = 202;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


const login = (req, res, next) => {
    console.log("Test")
    const token = req.body.token;
    if (token) {
        jwt.verify(token, process.env.JWT, [algorithm = "HS256"], (err, user) => {
            if (err) {
                console.log("!" + err)
                return res.sendStatus(403);
            }
            return res
                .cookie("jwt", token, {
                    httpOnly: true,
                })
                .status(200)
                .json({ message: "Logged in successfully" });
        });
    } else {
        res.sendStatus(401);
    }
}



route.get('/verify', authenticateJWT, (req, res) => {
    res.sendStatus(status)
});


/* route.post('/', login, async function (req, res, next) {
    var io = req.app.get('event');
    io.emit('my-event', 'Hello from route')
    console.log(status)
    res.sendStatus(status)
}); */


route.get('/', authenticateJWT, async (req, res) => {
    // Import the EventEmitter
    const event = req.app.get('event')
    // Here I send the string to the EventEmitter 
    event.emit('my-event', 'Hello from route')
    console.log(status)
    res.sendStatus(status)
})



route.post('/api/png_array', (req, res) => {
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

route.post('/api/edit_filter_name', (req, res) => {
    const optionsFilter = {
        method: req.method,
        uri: 'http://titan:5050/edit_filter_name',
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

route.post('/api/global_analysis', (req, res) => {
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

route.post('/api/heatmap_single_filter', (req, res) => {
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

route.post('/api/get_attribution_graph', (req, res) => {
    const options = {
        method: req.method,
        uri: 'http://titan:5050/get_attribution_graph',
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

route.post('/api/statistics', (req, res) => {
    const options = {
        method: req.method,
        uri: 'http://titan:5050/get_filter_statistics',
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

route.post('/api/get_image', (req, res) => {
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
route.post('/api/local_analysis', (req, res) => {
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

route.post('/api/get_XAI_available', (req, res) => {
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

route.post('/api/get_local_segments', (req, res) => {
    const options = {
        method: req.method,
        uri: 'http://titan:5050/get_local_segments',
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

route.post('/api/watershed', (req, res) => {
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

route.post('/api/get_heatmap', async (req, res) => {
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

route.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = route