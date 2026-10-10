
const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Subscription", SubscriptionSchema);
