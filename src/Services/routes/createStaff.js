const express = require('express');
const router = express.Router();
const connection = require('../DB/dbconnection'); // assuming connection is a pg.Pool

// Route
router.post('/', async (req, res) => {
  try {
    const { staff_name, mobile_number } = req.body;

    if (!staff_name) return res.json({ missing: 'Name is missing' });
    if (!mobile_number) return res.json({ missing: 'Mobile Number is missing' });

    const user_id = await generateNextUserId();

    const value = [user_id, staff_name, mobile_number];
    const query = 'INSERT INTO staff (user_id, staff_name, mobile_number) VALUES ($1, $2, $3)';
    const result = await connection.query(query, value);

    res.json({ message: 'Staff added successfully', user_id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


async function generateNextUserId() {
  const prefix = 'AMS';
  const result = await connection.query('SELECT user_id FROM staff ORDER BY user_id DESC LIMIT 1');

  if (result.rows.length === 0) {
    return prefix + '00001';
  }

  const lastId = result.rows[0].user_id; // e.g., AMS00012
  const lastNumber = parseInt(lastId.slice(3)); // Extract "00012" -> 12
  const nextNumber = (lastNumber + 1).toString().padStart(5, '0'); // "00013"

  return prefix + nextNumber; // "AMS00013"
}

module.exports = router;
