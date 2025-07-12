const express = require('express');
const connection = require('../../DB/dbconnection');
const router = express.Router();

// Route: DELETE http://localhost:3000/deletevistorStaff?visitor_name=Rahul%20Sharma
router.delete('/', async (req, res) => {
  const visitorName = req.query.visitor_name;


  if (!visitorName) {
    return res.status(400).json({ error: "visitor_name is required" });
  }

  try {
    const result = await connection.query(
      `DELETE FROM visitorstudent WHERE visitor_name = '${visitorName}'`
    );

    if (result.affectedRows > 0 || result.rowCount > 0) {
      res.status(200).json({ message: `Visitor '${visitorName}' deleted successfully.` });
    } else {
      res.status(404).json({ message: "Visitor not found" });
    }
  } catch (err) {
    console.error("Error deleting visitor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
