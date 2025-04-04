const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }
}, { timestamps: true });
participantSchema.index({ studentId: 1, event: 1 }, { unique: true });
module.exports = mongoose.model("Registration", registrationSchema);
