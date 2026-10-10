const express = require("express");
const router = express.Router();

const Plan = require("../models/plan");
const User = require("../models/User");
const Subscription = require("../models/subscription");
const isauth = require("../middleware/auth/authcheck");

router.get("/plans", isauth, async (req, res) => {
    try {
        const plans = await Plan.find();

        return res.status(200).json({
            message: "Plans fetched successfully",
            plans
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

const oneMonthFrom = (date) => {
    const result = new Date(date);
    const day = result.getDate();

    result.setDate(1);
    result.setMonth(result.getMonth() + 1);

    const lastDay = new Date(
        result.getFullYear(),
        result.getMonth() + 1,
        0
    ).getDate();

    result.setDate(Math.min(day, lastDay));

    return result;
};

router.post("/subscribe", isauth, async (req, res) => {
    try {
        const { planId } = req.body;

        if (!planId) {
            return res.status(400).json({
                message: "Plan ID is required"
            });
        }

        const selectedPlan = await Plan.findById(planId);

        if (!selectedPlan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        let existing = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        });

        if (existing && existing.endDate > new Date()) {
            return res.status(409).json({
                message: "You already have an active subscription"
            });
        }

        if (existing) {
            existing.status = "expired";
            await existing.save();
        }

        const startDate = new Date();
        const endDate = oneMonthFrom(startDate);

        const newSubscription = await Subscription.create({
            user: req.user.id,
            plan: selectedPlan._id,
            startDate,
            endDate,
            status: "active"
        });

        await User.findByIdAndUpdate(req.user.id, {
            subscription: newSubscription._id
        });

        return res.status(201).json({
            message: "Subscribed successfully",
            subscription: newSubscription
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.put("/upgrade-plan", isauth, async (req, res) => {
    try {
        const { planId } = req.body;

        if (!planId) {
            return res.status(400).json({
                message: "Plan ID is required"
            });
        }

        const selectedPlan = await Plan.findById(planId);

        if (!selectedPlan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        const currentSubscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        });

        if (
            !currentSubscription ||
            currentSubscription.endDate <= new Date()
        ) {
            if (currentSubscription) {
                currentSubscription.status = "expired";
                await currentSubscription.save();

                await User.findByIdAndUpdate(req.user.id, {
                    subscription: null
                });
            }

            return res.status(404).json({
                message: "No active subscription found"
            });
        }

        currentSubscription.plan = selectedPlan._id;
        currentSubscription.startDate = new Date();
        currentSubscription.endDate = oneMonthFrom(
            currentSubscription.startDate
        );

        await currentSubscription.save();

        return res.status(200).json({
            message: "Plan updated successfully",
            subscription: currentSubscription
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.post("/cancel-subscription", isauth, async (req, res) => {
    try {
        const currentSubscription = await Subscription.findOne({
            user: req.user.id,
            status: "active"
        });

        if (
            !currentSubscription ||
            currentSubscription.endDate <= new Date()
        ) {
            if (currentSubscription) {
                currentSubscription.status = "expired";
                await currentSubscription.save();
            }

            await User.findByIdAndUpdate(req.user.id, {
                subscription: null
            });

            return res.status(404).json({
                message: "No active subscription found"
            });
        }

        currentSubscription.status = "cancelled";
        currentSubscription.endDate = new Date();

        await currentSubscription.save();

        await User.findByIdAndUpdate(req.user.id, {
            subscription: null
        });

        return res.status(200).json({
            message: "Subscription cancelled successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;
