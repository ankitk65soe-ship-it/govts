import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// In-memory storage (demo purpose)
const complaints = [];

/* ==========================================
   AI CLASSIFICATION ROUTE
========================================== */
app.post("/api/ai-complaint", (req, res) => {
  const { complaint } = req.body;

  if (!complaint) {
    return res.status(400).json({ error: "Complaint is required" });
  }

  const text = complaint.toLowerCase();

  let department = "General Administration";
  let urgency = "Medium";

  // Electricity
  if (
    text.includes("electric") ||
    text.includes("power") ||
    text.includes("bijli") ||
    text.includes("light")
  ) {
    department = "Electricity Department";
    urgency = "High";
  }

  // Water
  else if (
    text.includes("water") ||
    text.includes("pani")
  ) {
    department = "Water Supply Department";
    urgency = "High";
  }

  // Road
  else if (
    text.includes("road") ||
    text.includes("pothole") ||
    text.includes("sadak")
  ) {
    department = "Public Works Department";
  }

  // Garbage
  else if (
    text.includes("garbage") ||
    text.includes("kachra") ||
    text.includes("clean")
  ) {
    department = "Municipal Corporation";
  }

  // Police
  else if (
    text.includes("police") ||
    text.includes("crime") ||
    text.includes("chori") ||
    text.includes("theft")
  ) {
    department = "Police Department";
    urgency = "High";
  }

  const description = `Complaint reported: ${complaint}.
This issue has been categorized under ${department}.
The urgency level is ${urgency}.
Authorities are expected to take necessary action.`;

  res.json({
    department,
    urgency,
    description
  });
});


/* ==========================================
   SUBMIT COMPLAINT ROUTE
========================================== */
app.post("/api/submit-complaint", (req, res) => {
  const { department, urgency, description } = req.body;

  if (!department || !description) {
    return res.status(400).json({ error: "Missing complaint data" });
  }

  const complaintId =
    "CMP" + Math.floor(100000 + Math.random() * 900000);

  const newComplaint = {
    id: complaintId,
    department,
    urgency,
    description,
    status: "In Progress",
    createdAt: new Date().toISOString()
  };

  complaints.push(newComplaint);

  res.json({
    message: "Complaint submitted successfully",
    complaintId
  });
});


/* ==========================================
   TRACK COMPLAINT ROUTE
========================================== */
app.get("/api/track/:id", (req, res) => {
  const complaint = complaints.find(
    (c) => c.id === req.params.id
  );

  if (!complaint) {
    return res.status(404).json({
      message: "Complaint not found"
    });
  }

  res.json(complaint);
});


/* ==========================================
   SERVER START
========================================== */
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});