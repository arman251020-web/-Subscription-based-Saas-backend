require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const seedPlans = require("./config/seedPlans");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

const userRoutes = require("./routes/userRoutes");
const auth = require("./routes/authRoutes");
const sub = require("./routes/subscriptionRoutes");

app.use("/user", userRoutes);
app.use("/auth", auth);
app.use("/sub", sub);


const startServer = async () => {
    try {
        await connectDB();
        await seedPlans();

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running");
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
};

startServer();