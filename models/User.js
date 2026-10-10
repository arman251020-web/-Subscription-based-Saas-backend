const mongoose = require("mongoose")
const subscription = require("./subscription")
const Userschema = new mongoose.Schema({
    name: {
        require: true,
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("User", Userschema);