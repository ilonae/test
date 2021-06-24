const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require("passport");

router.post("/register_login", (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return res.status(400).json({ errors: err });
        }
        if (!user) {
            return res.status(400).json({ errors: "No user found" });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
            }
            return res.status(200).json({ success: `logged in ${user.id}` });
        });
    })(req, res, next);
});

module.exports = router;
