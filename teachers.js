const express = require("express");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // Use the same secret key as in auth.js

// Middleware to verify Admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Fetch a teacher by name (User & Admin)
router.get("/:name", async (req, res) => {
  try {
    const teacherName = decodeURIComponent(req.params.name).trim();
    const nameRegex = new RegExp(`^${teacherName}$`, "i");
    const teacher = await Teacher.findOne({ name: nameRegex });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Fetch all teachers (For Admin Panel)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a new teacher (Admin Only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, branch, building, floor } = req.body;
    const newTeacher = new Teacher({ name, branch, building, floor });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding teacher" });
  }
});

// Update a teacher (Admin Only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { name, branch, building, floor } = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, branch, building, floor },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher" });
  }
});

// Delete a teacher (Admin Only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting teacher" });
  }
});

module.exports = router;
