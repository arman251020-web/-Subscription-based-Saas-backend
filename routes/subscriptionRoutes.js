const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Subscription = require("../models/subscription");
const isauth = require("../middleware/auth/authcheck");

router.get("/profile", isauth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate({
                path: "subscription",
                populate: {
                    path: "plan"
                }
            });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.get("/dashboard", isauth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active",
            endDate: { $gt: new Date() }
        }).populate("plan");

        return res.status(200).json({
            message: "Dashboard fetched successfully",
            subscription: subscription || null,
            hasActiveSubscription: Boolean(subscription)
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.get("/premium-content", isauth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: "active",
            endDate: { $gt: new Date() }
        }).populate("plan");

        if (!subscription || !subscription.plan) {
            return res.status(403).json({
                message: "An active subscription is required"
            });
        }

        if (subscription.plan.name !== "Premium") {
            return res.status(403).json({
                message: "Premium plan required"
            });
        }

        return res.status(200).json({
            message: "Welcome to premium content",
            content: [
                "Access to premium resources",
                "Exclusive tutorials",
                "Advanced features"
            ]
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;
