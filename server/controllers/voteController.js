const FutureParticipant = require("../models/futureParticipantModel");

const castVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { fingerprint } = req.body;

    if (!fingerprint) {
      return res.status(400).json({ message: "⚠️ Fingerprint is missing" });
    }

    const participant = await FutureParticipant.findById(id);
    if (!participant) {
      return res.status(404).json({ message: "⚠️ Participant not found" });
    }

    const category = participant.category;

    // ✅ Check if the user (based on fingerprint) has already voted in this category.
    const alreadyVotedInCategory = await FutureParticipant.findOne({
      "fingerprints.fingerprint": fingerprint,
      category: category, // Ensure we are looking in the same category
    });

    if (alreadyVotedInCategory) {
      return res.status(400).json({
        message: `You have already voted for ${category}!`,
      });
    }

    // ✅ Store fingerprint and category in the participant's fingerprint log.
    participant.fingerprints.push({ fingerprint, category });

    // Increment the vote count for this candidate.
    participant.votes += 1;
    await participant.save();

    return res.status(200).json({ message: "✅ Vote counted successfully", votes: participant.votes });

  } catch (error) {
    console.error("❌ Error casting vote:", error);
    return res.status(500).json({ message: "⚠️ Internal Server Error" });
  }
};


module.exports = { castVote };
