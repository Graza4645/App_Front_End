const express = require('express');
const router = express.Router();
const connection = require('../../DB/dbconnection')






// API endpoint to insert data
router.post('/', async (req, res) => {
  const {
    to_title,
    reference_no,
    address,
    note,
    from_title,
    date,
    upload_documents
  } = req.body;

  try {
    const result = await connection.query(
      `INSERT INTO postaldispatch
        (to_title, reference_no, address, note, from_title, date, upload_documents) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [to_title, reference_no, address, note, from_title, date, upload_documents]
    );

    res.status(201).json({ message: 'Document uploaded successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;