const express = require("express");
const multer = require("multer");
const path = require("path");
const Event = require("../models/eventModel");

const router = express.Router();

// ✅ Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/", // Images saved in 'uploads' folder
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ Fetch All Events (GET /api/events)
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ message: "Server error. Try again later.", error: error.message });
    }
});

// ✅ Add New Event (Prevent Duplicate Entries)
router.post("/add", upload.single("image"), async (req, res) => {
    try {
        const { title, date, description } = req.body;

        if (!title || !date || !description || !req.file) {
            return res.status(400).json({ message: "⚠️ All fields are required, including an image." });
        }

        console.log("📩 Received Request Body:", req.body);
        console.log("📷 Received File:", req.file);

        // ✅ Check for duplicate event with same title & date
        const existingEvent = await Event.findOne({ title, date: new Date(date) });

        if (existingEvent) {
            return res.status(400).json({ message: "❌ Event with the same name and date already exists!" });
        }

        // ✅ If event does not exist, create a new one
        const newEvent = new Event({
            title,
            date: new Date(date),
            description,
            imageUrl: `/uploads/${req.file.filename}`
        });

        await newEvent.save();
        res.status(201).json({ message: "✅ Event added successfully!", event: newEvent });

    } catch (error) {
        console.error("❌ Error adding event:", error);
        res.status(500).json({ message: "Server error. Please try again later.", error: error.message });
    }
});
// Edit
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// update
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { title, date, description } = req.body;

        if (!title || !date || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let updateFields = { title, date, description };

        // Check if a new image was uploaded
        if (req.file) {
            updateFields.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true } // Return updated event
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// ✅ Delete Event (DELETE /api/events/:id)
router.delete("/:id", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "⚠️ Event not found." });
        }
        res.json({ message: "✅ Event deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting event:", error);
        res.status(500).json({ message: "Server error while deleting event.", error: error.message });
    }
});

module.exports = router;
