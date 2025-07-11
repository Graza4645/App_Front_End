const express = require('express');
const router = express.Router();
const connection = require('../../DB/dbconnection');

router.post('/', async (req, res) => {
  try {
    const {
      purpose,
      meeting_with,
      class: className,
      section,
      id_card,
      student,
      date,
      visitor_name,
      out_time,
      phone_number,
      comments,
      number_of_person,
      in_time,
      upload_documents
    } = req.body;

    const query = `
      INSERT INTO visitorstudent (
        purpose,
        meeting_with,
        class,
        section,
        id_card,
        student,
        date,
        visitor_name,
        out_time,
        phone_number,
        comments,
        number_of_person,
        in_time,
        upload_documents
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    `;

    const values = [
      purpose,
      meeting_with,
      className,
      section,
      id_card,
      student,
      date,
      visitor_name,
      out_time,
      phone_number,
      comments,
      number_of_person,
      in_time,
      upload_documents
    ];

    await connection.query(query, values);
    res.json({ message: 'Visitor student added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add visitor student' });
  }
});

module.exports = router;
