const express = require('express')
const router = express.Router();
const connection = require('../../DB/dbconnection')

// API endpoint to fetch all uploaded documents
router.get('/', async (req, res) => {
  try {
    const result = await connection.query('SELECT * FROM postaldispatch ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports =router;
