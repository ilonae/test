const mongoose = require("mongoose");

// Create Schema
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
        },
        email_is_verified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { strict: false }
);

module.exports = mongoose.model("user", UserSchema);
