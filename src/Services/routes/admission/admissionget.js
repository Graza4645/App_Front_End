
const express = require('express');
const router = express.Router();
const connection = require('../../DB/dbconnection');

router.get('/', async (req, res) => {
  try {
    const result = await connection.query('SELECT * FROM admissionenquiries ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
