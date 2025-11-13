import "./visitorbook.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VisitorToolbar from "../../Global/VisitorToolbar";
import { API_BASE_URL } from "../../../config";

export default function VisitorBook() {
  const columns = [
    { key: "purpose", label: "PURPOSE" },
    { key: "meeting_with", label: "MEETING WITH" },
    { key: "visitor_name", label: "VISITOR NAME" },
    { key: "phone_number", label: "MOBILE" },
    { key: "id_card", label: "ID CARD" },
    { key: "number_of_person", label: "NO. OF PERSONS" },
    { key: "date", label: "DATE" },
    { key: "in_time", label: "IN TIME" },
    { key: "out_time", label: "OUT TIME" }
  ];

  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const visitorsPerPage = 20;

  useEffect(() => {
  const fetchVisitors = async () => {
    try {
      const apiUrl = API_BASE_URL || 'http://localhost:3000/api/v1';
      console.log('API_BASE_URL:', apiUrl);

      // Fetch student visitors
      console.log('Fetching visitorStudent from:', `${apiUrl}/visitorStudent`);
      const studentRes = await fetch(`${apiUrl}/visitorStudent`);
      const studentData = await studentRes.json();
      console.log('visitorStudent data:', studentData);

      // Fetch staff visitors
      console.log('Fetching visitorstaff from:', `${apiUrl}/visitorstaff`);
      const staffRes = await fetch(`${apiUrl}/visitorstaff`);
      const staffData = await staffRes.json();
      console.log('visitorstaff data:', staffData);

      // Handle both API structures (either direct array or { data: [] })
      const studentList = Array.isArray(studentData)
        ? studentData
        : studentData.data || [];

      const staffList = Array.isArray(staffData)
        ? staffData
        : staffData.data || [];

      // Combine both lists
      const combinedData = [...studentList, ...staffList];
      console.log('✅ Combined visitors data:', combinedData);

      setVisitors(combinedData);
    } catch (error) {
      console.error('❌ Error fetching visitor data:', error);
    }
  };

  fetchVisitors();
}, []);

  const handleView = (visitor) => {
    setSelectedVisitor(visitor);
    setShowModal(true);
  };

  const handleEdit = async (visitor) => {
    const updatedName = prompt("Edit visitor name:", visitor.visitor_name);
    if (!updatedName?.trim()) return;

    try {
      const updatedVisitor = { ...visitor, visitor_name: updatedName };
      const response = await fetch(`${API_BASE_URL}/updateVisitor/${visitor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVisitor),
      });
      if (!response.ok) throw new Error("Failed to update visitor");

      setVisitors((prev) => prev.map((v) => (v.id === visitor.id ? updatedVisitor : v)));
      alert("Visitor updated successfully!");
    } catch (err) {
      console.error("Error updating visitor:", err);
      alert("Update failed!");
    }
  };

  const handleDelete = async (visitor) => {
    const name = visitor.visitor_name;
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/deleteVisitor/${visitor.id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete visitor");

      setVisitors((prev) => prev.filter((v) => v.id !== visitor.id));
      alert("Visitor deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting visitor");
    }
  };

  const totalPages = Math.ceil(visitors.length / visitorsPerPage);
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);
  
 

  return (
    <>
      <div className="createbutton">
        <div className="leftvistor">Front Office → Visitor Book</div>
        <div className="rightvisitor" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VisitorToolbar visitors={currentVisitors} columns={columns} />
          <button type="button" className="create" onClick={() => navigate("/createvisitor")}>
            Create New +
          </button>
        </div>
      </div>

      <main>
        <div id="printArea" className="table-container">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentVisitors.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1}>No visitor data available.</td>
                </tr>
              ) : (
                currentVisitors.map((visitor, index) => (
                  <tr key={index}>
                    {columns.map((col) => (
                      <td key={col.key}>{visitor[col.key] || "N/A"}</td>
                    ))}
                    <td>
                      <div className="action-menu">
                        <i className="fas fa-ellipsis-v"></i>
                        <div className="dropdown-content">
                          <div className="view" onClick={() => handleView(visitor)}>View</div>
                          <div className="edit" onClick={() => handleEdit(visitor)}>Edit</div>
                          <div className="Delete" onClick={() => handleDelete(visitor)}>Delete</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && selectedVisitor && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Visitor Details</h3>
                <span className="close-button" onClick={() => setShowModal(false)}>×</span>
              </div>
              <div className="modal-body">
                {columns.map((col) => (
                  <p key={col.key}>
                    <strong>{col.label}:</strong> {selectedVisitor[col.key] || "N/A"}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="pagination">
        <span className="count">Page: {currentPage} of {totalPages}</span>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        <button className="active">{currentPage}</button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </>
  );
}