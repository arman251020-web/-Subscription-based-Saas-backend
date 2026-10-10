
const Plan = require("../models/plan");

const plans = [
    {
        name: "Free",
        price: 0,
        features: ["Basic access", "1 GB storage"]
    },
    {
        name: "Basic",
        price: 199,
        features: ["Standard access", "10 GB storage"]
    },
    {
        name: "Premium",
        price: 499,
        features: ["Full access", "100 GB storage", "Premium content"]
    }
];

const seedPlans = async () => {
    for (const plan of plans) {
        await Plan.updateOne(
            { name: plan.name },
            { $setOnInsert: plan },
            { upsert: true }
        );
    }

    console.log("Default plans checked successfully");
};

module.exports = seedPlans;
