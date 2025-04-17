import React, { useState } from "react";
import axios from "axios";
import './App.css';



function App() {
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTeacher = async () => {
    if (!name.trim()) {
      setError("Please enter a teacher's name.");
      return;
    }

    setLoading(true);
    setError("");
    setTeacher(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/teachers/${encodeURIComponent(name.trim().toLowerCase())}`
      );
      setTeacher(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Teacher not found.");
      } else {
        setError("An error occurred while fetching data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchTeacher();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Teacher Cabin Finder</h1>
      <input
        type="text"
        placeholder="Enter teacher's name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ padding: "10px", marginRight: "10px" }}
        aria-label="Teacher's Name"
      />
      <button onClick={fetchTeacher} style={{ padding: "10px" }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {teacher && (
        <div>
          <h2>{teacher.name}</h2>
          <p>
            <strong>Branch:</strong> {teacher.branch}
          </p>
          <p>
            <strong>Building:</strong> {teacher.building}
          </p>
          <p>
            <strong>Floor:</strong> {teacher.floor}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
