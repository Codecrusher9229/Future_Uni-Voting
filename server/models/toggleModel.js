const mongoose = require("mongoose");

const toggleSchema = new mongoose.Schema({
    registerDisabled: { type: Boolean, default: false },
    voteDisabled: { type: Boolean, default: false }
});

module.exports = mongoose.model("Toggle", toggleSchema);
