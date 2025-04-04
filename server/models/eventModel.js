const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true }, // ✅ Store image path
    createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
