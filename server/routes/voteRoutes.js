const express = require("express");
const FutureParticipant = require("../models/futureParticipantModel");
const { castVote } = require("../controllers/voteController");
const router = express.Router();

// ✅ Middleware for validating participant ID
const validateParticipant = async (req, res, next) => {
  try {
    const participant = await FutureParticipant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: "⚠️ Participant not found" });
    }
    req.participant = participant;
    next();
  } catch (error) {
    console.error("❌ Error validating participant:", error);
    res.status(500).json({ message: "⚠️ Server error" });
  }
};

// ✅ Voting Route
router.post("/vote/:id", validateParticipant, castVote);

// ✅ Get All Participants
router.get("/participants", async (req, res) => {
  try {
    const participants = await FutureParticipant.find();
    res.status(200).json(participants);
  } catch (error) {
    console.error("❌ Error fetching participants:", error);
    res.status(500).json({ message: "⚠️ Server error" });
  }
});

// ✅ Leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await FutureParticipant.find().sort({ votes: -1 }).limit(10);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    res.status(500).json({ message: "⚠️ Server error" });
  }
});

module.exports = router;
