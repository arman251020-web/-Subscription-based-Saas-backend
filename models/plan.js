
const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["Free", "Basic", "Premium"],
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    features: {
        type: [String],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Plan", PlanSchema);
