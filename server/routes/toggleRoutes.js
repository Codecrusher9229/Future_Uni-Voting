const express = require("express");
const router = express.Router();
const Toggle = require("../models/toggleModel");

// ✅ GET Current Toggle State
router.get("/", async (req, res) => {
    try {
        let toggleState = await Toggle.findOne();
        if (!toggleState) {
            toggleState = new Toggle(); // Create default state if not found
            await toggleState.save();
        }
        res.json(toggleState);
    } catch (error) {
        console.error("Error fetching toggle state:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ POST: Update Both Toggles
router.post("/toggle-button", async (req, res) => {
    try {
        const { registerDisabled, voteDisabled } = req.body;

        let toggleState = await Toggle.findOne();
        if (!toggleState) {
            toggleState = new Toggle(); // Create default state if not found
        }

        toggleState.registerDisabled = registerDisabled;
        toggleState.voteDisabled = voteDisabled;
        await toggleState.save();

        res.json({ message: "✅ Toggle state updated!", registerDisabled, voteDisabled });
    } catch (error) {
        console.error("Error updating toggle state:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
