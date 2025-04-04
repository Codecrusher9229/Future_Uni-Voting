const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Event = require("../models/eventModel");
const Participant = require("../models/participantModel");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Test Route
router.get("/", (req, res) => {
    res.json({ message: "Admin API is working!" });
});

// 🔐 Admin Login (Uses Username Instead of Email)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login Attempt:", username, password);

        const admin = await Admin.findOne({ username });
        console.log("Admin Found:", admin);

        if (!admin) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret is not set on the server" });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.json({ token, admin: { id: admin._id, username: admin.username } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// 🔐 Protected Route (Only for Admins)
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Admin Dashboard Access Granted" });
});

// 🏆 Add a New Event (Admin Only)
router.post("/add-event", authMiddleware, async (req, res) => {
    try {
        const { title, date, description } = req.body;

        if (!title || !date || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newEvent = new Event({
            title: title.trim(),
            date,
            description: description.trim(),
        });

        await newEvent.save();

        res.status(201).json({ message: "Event added successfully!", event: newEvent });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
});

// 📝 Get Registered Participants (Admin Only)
router.get("/registered-participants", authMiddleware, async (req, res) => {
    try {
        const participants = await Participant.find().populate("event"); // ✅ Ensure Event is populated
        res.json(participants);
    } catch (error) {
        console.error("Error fetching participants:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// 📜 Fetch All Events (Public API, No Authentication Required)
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
});
// Update Participants
router.put("/update-participant/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, department, studentId, email, phone } = req.body;

        const updatedParticipant = await Participant.findByIdAndUpdate(
            id,
            { fullName, department, studentId, email, phone },
            { new: true }
        );

        if (!updatedParticipant) return res.status(404).json({ error: "Participant not found" });

        res.json({ message: "Participant updated successfully", updatedParticipant });
    } catch (error) {
        res.status(500).json({ error: "Failed to update participant" });
    }
});

// Delete Participants
router.delete("/delete-participant/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedParticipant = await Participant.findByIdAndDelete(id);
        if (!deletedParticipant) return res.status(404).json({ error: "Participant not found" });

        res.json({ message: "Participant deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete participant" });
    }
});

// Delete All Participants
router.delete("/delete-all-participants", async (req, res) => {
    try {
        await Participant.deleteMany({});
        res.json({ message: "All participants deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete all participants" });
    }
});

// ✏️ Update an Event (Admin Only)
router.put("/update-event/:id", authMiddleware, async (req, res) => {
    try {
        const { title, date, description } = req.body;

        if (!title || !date || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { title: title.trim(), date, description: description.trim() },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json({ message: "Event updated successfully!", event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
});

// ❌ Delete an Event (Admin Only)
router.delete("/delete-event/:id", authMiddleware, async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json({ message: "Event deleted successfully!" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
});

module.exports = router;
