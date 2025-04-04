const express = require("express");
const Participant = require("../models/participantModel");
const Event = require("../models/eventModel");

const router = express.Router();

// ✅ Register Participant API
router.post("/register", async (req, res) => {
    try {
        const { fullName, department, studentId, email, phone, eventId } = req.body;

        if (!fullName || !department || !studentId || !email || !phone || !eventId) {
            return res.status(400).json({ message: "⚠️ All fields are required!" });
        }

        // ✅ Check if the same student has already registered for the same event
        const existingParticipant = await Participant.findOne({ studentId, email, event: eventId });

        if (existingParticipant) {
            return res.status(400).json({ message: "❌ You have already registered for this event!" });
        }

        // ✅ Create new participant entry
        const newParticipant = new Participant({
            fullName,
            department,
            studentId,
            email,
            phone,
            event: eventId
        });

        await newParticipant.save();
        res.status(201).json({ message: "✅ Registration successful!", participant: newParticipant });

    } catch (error) {
        console.error("❌ Error registering participant:", error);
        res.status(500).json({ message: "⚠️ Server error. Try again later." });
    }
});

// ✅ Delete Expired Participants Manually
router.delete("/clear-expired-participants", async (req, res) => {
    try {
        const today = new Date();
        const expiredEvents = await Event.find({ date: { $lt: today } });

        if (expiredEvents.length === 0) {
            return res.status(200).json({ message: "✅ No expired events found!" });
        }

        const expiredEventIds = expiredEvents.map(event => event._id);

        // ✅ Delete all participants registered for these events
        await Participant.deleteMany({ event: { $in: expiredEventIds } });

        res.status(200).json({ message: `✅ Deleted participants for ${expiredEvents.length} expired events.` });
    } catch (error) {
        console.error("❌ Error deleting expired participants:", error);
        res.status(500).json({ message: "⚠️ Server error", error: error.message });
    }
});
module.exports = router;
