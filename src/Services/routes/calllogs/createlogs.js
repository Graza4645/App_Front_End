const express = require("express");
const router  = express.Router();

const connection = require('../../DB/dbconnection');




router.post("/", async (req, res) => {
  try {
    const {
      name,
      number,
      date,
      description,
      nextFollowUpDate,
      duration,
      note,
      callType,
    } = req.body;
    console.log(req.body)
    const result = await connection.query(
      `INSERT INTO phone_call_logs 
       (name, number, date, description, next_follow_up_date, duration, note, call_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, number, date, description, nextFollowUpDate, duration, note, callType]
    );

    res.status(201).json({ message: "Phone Call Log saved", data: result.rows[0] });
  } catch (err) {
    console.error("Error inserting log:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;
