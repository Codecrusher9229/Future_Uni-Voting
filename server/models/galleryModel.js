const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: false, // ✅ Event ID ab optional hai
    },
    imageUrl: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Gallery", gallerySchema);
