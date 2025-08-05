const express = require("express");
const router = express.Router();
const connection  = require('../../DB/dbconnection')

router.post("/", async (req, res) => {
  const {
    complaint_type,
    source,
    complain_by,
    phone,
    date,
    description,
    action_taken,
    assigned,
    note,
    upload_documents,
  } = req.body;

  try {
    await connection.query(
      `INSERT INTO complaints 
       (complaint_type, source, complain_by, phone, date, description, action_taken, assigned, note, upload_documents) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [complaint_type, source, complain_by, phone, date, description, action_taken, assigned, note, upload_documents]
    );
    res.status(200).json({ message: "Complaint saved successfully" });
  } catch (err) {
    console.error("Error saving complaint:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;