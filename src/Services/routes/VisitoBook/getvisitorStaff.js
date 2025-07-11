
const express = require('express');
const connection = require('../../DB/dbconnection');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM public.visitorbook';
    const result = await connection.query(query);
    res.json(result.rows); 
  } catch (err) {
    console.error('Error fetching visitor Staff data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;



