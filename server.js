require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Teacher = require("./models/Teacher");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/teacherCabinDB";

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Add API route to fetch a teacher by name (case-insensitive)
app.get("/api/teachers/:name", async (req, res) => {
  try {
    const teacherName = decodeURIComponent(req.params.name).trim(); // Handle URL encoding and trim whitespace
    console.log("Searching for:", teacherName);

    // Create a case-insensitive regular expression for the name
    const nameRegex = new RegExp(`^${teacherName}$`, "i");

    const teacher = await Teacher.findOne({ name: nameRegex });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
