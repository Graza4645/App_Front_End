const express = require('express');
const router = express.Router();
const connection = require('../../DB/dbconnection');

router.post('/', async (req, res) => {
  try {
    const { purpose, meeting_with, staff, visitor_name, id_card, phone_number, date, number_of_person, in_time, out_time, comments, upload_documents } = req.body;
    const query = 'INSERT INTO visitorbook (purpose, meeting_with, staff, visitor_name, id_card, phone_number, date, number_of_person, in_time, out_time, comments, upload_documents) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
    const values = [purpose, meeting_with, staff, visitor_name, id_card, phone_number, date, number_of_person, in_time, out_time, comments, upload_documents];
    await connection.query(query,values );
    res.json({ message: 'Visitor added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add visitor' });
  }
});

module.exports = router;
