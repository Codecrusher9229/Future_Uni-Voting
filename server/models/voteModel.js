const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    participantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "FutureParticipant", 
        required: true 
    },
    userIp: { type: String, required: true }, // ✅ Renamed to match route variable
    timestamp: { type: Date, default: Date.now }
});

// ✅ Ensures each IP can vote only ONCE per participant
voteSchema.index({ userIp: 1, participantId: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
module.exports = Vote;
