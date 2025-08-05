// server.js or routes.js
const express = require("express");
const router = express.Router();
const connection = require('../../DB/dbconnection')



// Create Dispatch API
router.post("/", async (req, res) => {
  const {
    from_title,
    reference_no,
    address,
    note,
    to_title,
    date,
    upload_documents,
  } = req.body;

  try {
    const result = await connection.query(
      `INSERT INTO postal_receive 
       (from_title, reference_no, address, note, to_title, date, upload_documents)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [from_title, reference_no, address, note, to_title, date, upload_documents]
    );

    res.status(201).json({ message: "Receive created", data: result.rows[0] });
  } catch (err) {
    console.error("Error inserting receive:", err);
    res.status(500).json({ error: "Failed to create dispatch" });
  }
});


module.exports = router;
