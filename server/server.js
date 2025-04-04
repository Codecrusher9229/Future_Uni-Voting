const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");

// ✅ Environment variables ko load karne ke liye
dotenv.config();

// ✅ Routes import kar rahe hain
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const registerRoutes = require("./routes/registerRoutes");
const futureRoutes = require("./routes/futureRoutes");
const voteRoutes = require("./routes/voteRoutes");
const toggleRoutes = require("./routes/toggleRoutes");

const app = express();

// ✅ Middleware setup
app.use(cors());
app.use(express.json());

// ✅ Static files serve karne ke liye
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ IP Rate Limiting (To Prevent Multiple Refresh Attacks)
// ✅ IP Rate Limiting (To Prevent Multiple Refresh Attacks)
// const requestCounts = {};
// const blockedIPs = new Map();
// const MAX_REQUESTS = 20; // Maximum allowed requests per minute
// const TIME_WINDOW = 60000; // 1 minute in milliseconds
// const BLOCK_TIME =  600000; // Block time of 10 minute

// app.use((req, res, next) => {
//     const userIP = req.ip;

//     // ✅ Unblock IP if block time has expired
//     if (blockedIPs.has(userIP)) {
//         const blockExpiresAt = blockedIPs.get(userIP);
//         if (Date.now() > blockExpiresAt) {
//             blockedIPs.delete(userIP);
//             console.log(`✅ IP Unblocked: ${userIP}`);
//         } else {
//             const remainingTime = Math.ceil((blockExpiresAt - Date.now()) / 1000);
//             res.setHeader('Retry-After', remainingTime);
//             return res.status(429).json({ error: `Too many requests. Please try again in ${remainingTime} seconds.` });
//         }
//     }

//     // ✅ Track requests
//     if (!requestCounts[userIP]) {
//         requestCounts[userIP] = { count: 1, startTime: Date.now() };
//     } else {
//         const timePassed = Date.now() - requestCounts[userIP].startTime;

//         if (timePassed < TIME_WINDOW) {
//             requestCounts[userIP].count++;
//             if (requestCounts[userIP].count > MAX_REQUESTS) {
//                 blockedIPs.set(userIP, Date.now() + BLOCK_TIME);
//                 console.log(`🚫 Blocked IP: ${userIP} for 10 minute`);
//                 return res.status(429).json({ error: "Too many requests. You have been temporarily blocked for 1 minute." });
//             }
//         } else {
//             // ✅ Reset counter after the time window
//             requestCounts[userIP] = { count: 1, startTime: Date.now() };
//         }
//     }

//     next();
// });
// ✅ API Routes
app.use("/api", registerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/future", futureRoutes);
app.use("/api", voteRoutes);
app.use("/api/toggle", toggleRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

// ✅ Daily automatic cleanup ka ek function
cron.schedule("0 0 * * *", async () => {
    try {
        const today = new Date();
        const expiredEvents = await Event.find({ date: { $lt: today } });

        if (expiredEvents.length > 0) {
            const expiredEventIds = expiredEvents.map(event => event._id);
            await Participant.deleteMany({ event: { $in: expiredEventIds } });
            console.log(`🗑️ Deleted participants for ${expiredEvents.length} expired events.`);
        }
    } catch (error) {
        console.error("❌ Error cleaning expired participant data:", error);
    }
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
    })
    .catch(err => console.error("❌ Error: ", err));
