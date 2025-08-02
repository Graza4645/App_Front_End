
const express = require('express');
const router = express.Router();
const connection = require('../../DB/dbconnection');


router.get("/", async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM phone_call_logs ORDER BY id DESC");
    res.status(200).json({ message: "Fetched successfully", data: result.rows });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;