const mongoose = require("mongoose");

// Define the Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: String, required: true }
});

// Create the Teacher model
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher; // Export the model
