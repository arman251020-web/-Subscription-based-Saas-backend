
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const checkEmail = await User.findOne({ email });

        if (checkEmail) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        const hash = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            name,
            email,
            password: hash,
        });


        const token = jwt.sign(
            { id: newUser._id ,subscription:newUser.subscription},
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        return res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Email or password incorrect"
            });
        }

        const pass = await bcrypt.compare(password, user.password);

        if (!pass) {
            return res.status(401).json({
                message: "Email or password incorrect"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});






module.exports = router;
