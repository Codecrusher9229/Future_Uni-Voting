const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    department: { type: String, required: true },
    studentId: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // ✅ Ensures event is linked
    createdAt: { type: Date, default: Date.now }
});
// ✅ Unique constraint on studentId + event combination
participantSchema.index({ studentId: 1, event: 1 }, { unique: true });
const Participant = mongoose.model("Participant", participantSchema);
module.exports = Participant;
