const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // For file deletion
const Gallery = require("../models/galleryModel");

const router = express.Router();

// ✅ Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// ✅ Route to Upload Images
router.post("/upload", upload.array("images", 10), async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "⚠️ No images uploaded." });
        }

        const uploadedImages = req.files.map(file => ({
            eventId: eventId || null,
            imageUrl: `/uploads/${file.filename}`
        }));

        await Gallery.insertMany(uploadedImages);

        res.status(201).json({ message: "✅ Images uploaded successfully!", files: uploadedImages });
    } catch (error) {
        console.error("❌ Image Upload Error:", error);
        res.status(500).json({ message: "⚠️ Server error. Try again later.", error: error.message });
    }
});

// ✅ Route to Fetch All Images
router.get("/fetch", async (req, res) => {
    try {
        const images = await Gallery.find();
        res.status(200).json(images);
    } catch (error) {
        console.error("❌ Fetch Images Error:", error);
        res.status(500).json({ message: "⚠️ Server error. Try again later." });
    }
});

// ✅ Route to Delete an Image
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Gallery.findById(id);

        if (!image) {
            return res.status(404).json({ message: "⚠️ Image not found." });
        }

        // Delete image file from storage
        const filePath = path.join(__dirname, "..", image.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Gallery.findByIdAndDelete(id);
        res.status(200).json({ message: "✅ Image deleted successfully!" });
    } catch (error) {
        console.error("❌ Delete Image Error:", error);
        res.status(500).json({ message: "⚠️ Server error. Try again later." });
    }
});

module.exports = router;
