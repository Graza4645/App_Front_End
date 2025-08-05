const express = require('express')
const router = express.Router();
const connection = require('../../DB/dbconnection')

router.get("/", async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM complaints ORDER BY id DESC");
    res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
