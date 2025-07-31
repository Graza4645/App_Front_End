const express = require('express');
const router = express.Router();
const connection = require('../../DB/dbconnection')



router.post('/', async (req, res) => {
  const {
    name,
    phone,
    email,
    address,
    description,
    note,
    date,
    next_follow_up_date,
    assigned,
    reference,
    source,
    class: studentClass,
    number_of_child
  } = req.body;

 
  try {
    const query = `
      INSERT INTO admissionenquiries (
        name, phone, email, address, description, note,
        date, next_follow_up_date, assigned, reference,
        source, class, number_of_child
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    `;

    await  connection.query(query, [
      name, phone, email, address, description, note,
      date, next_follow_up_date, assigned, reference,
      source, studentClass, number_of_child
    ]);

    res.status(200).json({ message: 'Enquiry submitted successfully' });
  } catch (error) {
    console.error('Error inserting enquiry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
