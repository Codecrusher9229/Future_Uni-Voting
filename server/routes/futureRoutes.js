const express = require("express");
const multer = require("multer");
const path = require("path");
const FutureParticipant = require("../models/futureParticipantModel");

const router = express.Router();

// ✅ Multer Storage for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/futureParticipants/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// ✅ Register Participant for "Mr. & Miss Future"
router.post("/register", upload.single("candidateImg"), async (req, res) => {
    console.log("🔹 /api/future/register endpoint hit!");
    try {
        const { fullName, department, category } = req.body;

        if (!fullName || !department || !category || !req.file) {
            return res.status(400).json({ message: "⚠️ All fields are required!" });
        }

        const candidateImg = `/uploads/futureParticipants/${req.file.filename}`; // Image path

        // ✅ Check if participant already registered
        // const existingParticipant = await FutureParticipant.findOne({ studentId, email });

        // if (existingParticipant) {
        //     return res.status(400).json({ message: "❌ You have already registered!" });
        // }

        // ✅ Create new participant
        const newParticipant = new FutureParticipant({
            fullName,
            department,
            candidateImg,
            category
        });

        await newParticipant.save();
        res.status(201).json({ message: "✅ Registration successful!", participant: newParticipant });

    } catch (error) {
        console.error("❌ Error registering participant:", error);
        res.status(500).json({ message: "⚠️ Server error. Try again later." });
    }
});

// ✅ Fetch Registered Participants
router.get("/participants", async (req, res) => {
    try {
        const participants = await FutureParticipant.find();
        res.status(200).json(participants);
    } catch (error) {
        console.error("❌ Error fetching participants:", error);
        res.status(500).json({ message: "⚠️ Server error" });
    }
});
// ✅ Leaderboard API
router.get("/leaderboard", async (req, res) => {
    try {
        const mrFuture = await FutureParticipant.find({ category: "Mr Future" }).sort({ votes: -1 });
        const missFuture = await FutureParticipant.find({ category: "Miss Future" }).sort({ votes: -1 });

        res.status(200).json({ mrFuture, missFuture });
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: "⚠️ Server error" });
    }
});
module.exports = router;
