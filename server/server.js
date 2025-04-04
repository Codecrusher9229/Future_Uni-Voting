const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");

dotenv.config();

// ✅ Routes
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const registerRoutes = require("./routes/registerRoutes");
const futureRoutes = require("./routes/futureRoutes");
const voteRoutes = require("./routes/voteRoutes");
const toggleRoutes = require("./routes/toggleRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api", registerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/future", futureRoutes);
app.use("/api", voteRoutes);
app.use("/api/toggle", toggleRoutes);

// ✅ Default route to fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Backend server is running successfully!");
});

// ✅ Daily cleanup task (optional)
cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    const expiredEvents = await Event.find({ date: { $lt: today } });

    if (expiredEvents.length > 0) {
      const expiredEventIds = expiredEvents.map(event => event._id);
      await Participant.deleteMany({ event: { $in: expiredEventIds } });
      console.log(`🗑️ Deleted participants for ${expiredEvents.length} expired events.`);
    }
  } catch (error) {
    console.error("❌ Error cleaning expired participant data:", error);
  }
});

// ✅ MongoDB + Server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch(err => console.error("❌ Error: ", err));
