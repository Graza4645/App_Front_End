// VisitorTable.jsx
import './visitorbook.css';

export default function VisitorBook() {
  return (
    <main>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Meeting With</th>
              <th>Visitor Name</th>
              <th>Phone</th>
              <th>Id card</th>
              <th>Number OF Person</th>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>To enquire about admission & fee structure</td>
              <td>Principal</td>
              <td>John Doe</td>
              <td>9876543210</td>
              <td>Voter ID</td>
              <td>2</td>
              <td>2025-07-03</td>
              <td>10:00 AM</td>
              <td>10:30 AM</td>
              <td>Edit | Delete</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
