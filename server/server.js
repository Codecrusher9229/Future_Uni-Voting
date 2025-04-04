const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files (this serves everything inside "public")
app.use(express.static(path.join(__dirname, "public")));

// ✅ Import API routes
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const registerRoutes = require("./routes/registerRoutes");
const futureRoutes = require("./routes/futureRoutes");
const voteRoutes = require("./routes/voteRoutes");
const toggleRoutes = require("./routes/toggleRoutes");

// ✅ API Routes
app.use("/api", registerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/future", futureRoutes);
app.use("/api", voteRoutes);
app.use("/api/toggle", toggleRoutes);

// ✅ Serve frontend index.html (for root path "/")
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Serve subdirectories like "/admin", "/clubs"
app.get("/:subdir", (req, res) => {
  const subdir = req.params.subdir;
  const filePath = path.join(__dirname, "public", subdir, "index.html");
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("Not Found");
  });
});

// ✅ MongoDB Connection & Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch(err => console.error("❌ Error: ", err));
