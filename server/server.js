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

// ✅ Serve frontend from "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api", registerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/future", futureRoutes);
app.use("/api", voteRoutes);
app.use("/api/toggle", toggleRoutes);

// ✅ Daily cleanup task
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

// ✅ Start server after DB connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch(err => console.error("❌ Error: ", err));
