const jwt = require('jsonwebtoken')
const config = require('../config')



function validateToken(req, res, next) {
    if (req != undefined) {
        const token = req.body.token || req.query.token || req.headers['master-token']
        console.log('hello', req.body);

        if (token) {
            jwt.verify(token, config.JWTSecret, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.',
                    })
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            return res.status(406).send({
                success: false,
                message: 'No token provided.',
            })
        }
    }

}


module.exports = validateToken