const express = require('express')
const router = express.Router();
const connection = require('../../DB/dbconnection')

router.get("/", async (req, res) => {
  try {
    const result = await connection.query("SELECT * FROM postal_receive ORDER BY id DESC");
    res.status(200).json({ data: result.rows });
  } catch (err) {
    console.error("Error fetching dispatch records:", err);
    res.status(500).json({ error: "Failed to fetch dispatch records" });
  }
});

module.exports = router;
