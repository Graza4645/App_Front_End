// import "./visitorbook.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
//  import VisitorToolbar from "../../Global/VisitorToolbar";

// export default function VisitorBook() {
//   const headers = [
//     "purpose",
//     "meeting_with",
//     "visitor_name",
//     "phone",
//     "id_card",
//     "number_of_person",
//     "date",
//     "in_time",
//     "out_time"
//   ];

//   const navigate = useNavigate();
//   const [visitors, setVisitors] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedVisitor, setSelectedVisitor] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const visitorsPerPage = 20;

//   useEffect(() => {
//     const fetchVisitors = async () => {
//       try {
//         const studentRes = await fetch("http://localhost:3000/getvisitorStudent");
//         const studentData = await studentRes.json();
//         const staffRes = await fetch("http://localhost:3000/getvisitorStaff");
//         const staffData = await staffRes.json();

//         setVisitors([...(studentData || []), ...(staffData || [])]);
//       } catch (error) {
//         console.error("Error fetching visitor data:", error);
//       }
//     };
//     fetchVisitors();
//   }, []);

//   const handleView = (visitor) => {
//     setSelectedVisitor(visitor);
//     setShowModal(true);
//   };

//   const handleEdit = async (visitor) => {
//     const updatedName = prompt(
//       "Edit visitor name:",
//       visitor.visitor_name || visitor.staff || visitor.student
//     );
//     if (!updatedName?.trim()) return;

//     try {
//       const updatedVisitor = { ...visitor, visitor_name: updatedName };
//       const response = await fetch(
//         `http://localhost:3000/updateVisitor/${visitor.id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedVisitor),
//         }
//       );
//       if (!response.ok) throw new Error("Failed to update visitor");

//       setVisitors((prev) =>
//         prev.map((v) => (v.id === visitor.id ? updatedVisitor : v))
//       );

//       alert("Visitor updated successfully!");
//     } catch (err) {
//       console.error("Error updating visitor:", err);
//       alert("Update failed!");
//     }
//   };

//   const handleDelete = async (visitor) => {
//     const name = visitor.visitor_name || visitor.staff || visitor.student;
//     if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

//     const encodedName = encodeURIComponent(name);
//     try {
//       let response = await fetch(
//         `http://localhost:3000/deletevistorStaff?visitor_name=${encodedName}`,
//         { method: "DELETE" }
//       );

//       if (!response.ok) {
//         response = await fetch(
//           `http://localhost:3000/deletevistorStudent?visitor_name=${encodedName}`,
//           { method: "DELETE" }
//         );
//         if (!response.ok) throw new Error("Failed to delete visitor");
//       }

//       setVisitors((prev) =>
//         prev.filter((v) => (v.visitor_name || v.staff || v.student) !== name)
//       );

//       alert("Visitor deleted successfully");
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Error deleting visitor");
//     }
//   };

//   // Pagination
//   const totalPages = Math.ceil(visitors.length / visitorsPerPage);
//   const indexOfLastVisitor = currentPage * visitorsPerPage;
//   const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
//   const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

//   return (
//     <>
//       <div className="createbutton">
//   <div className="leftvistor">Front Office → Visitor Book</div>
//   <div
//     className="rightvisitor"
//     style={{ display: "flex", alignItems: "center", gap: "10px" }}
//   >
//    <VisitorToolbar visitors={visitors,headers} />
//     <button
//       type="button"
//       className="create"
//       onClick={() => navigate("/createvisitor")}
//     >
//       Create New +
//     </button>
//   </div>
// </div>


//       <main>
//         <div id="printArea" className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 {headers.map((header) => (
//                   <th key={header}>{header.replace(/_/g, " ").toUpperCase()}</th>
//                 ))}
//                 <th>ACTION</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentVisitors.map((visitor, index) => (
//                 <tr key={index}>
//                   {headers.map((header) => (
//                     <td key={header}>{visitor[header] || "N/A"}</td>
//                   ))}
//                   <td>
//                     <div className="action-menu">
//                       <i className="fas fa-ellipsis-v"></i>
//                       <div className="dropdown-content">
//                         <div className="view" onClick={() => handleView(visitor)}>View</div>
//                         <div className="edit" onClick={() => handleEdit(visitor)}>Edit</div>
//                         <div className="Delete" onClick={() => handleDelete(visitor)}>Delete</div>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {visitors.length === 0 && (
//                 <tr>
//                   <td colSpan={headers.length + 1}>No visitor data available.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {showModal && selectedVisitor && (
//           <div className="modal-overlay">
//             <div className="modal">
//               <div className="modal-header">
//                 <h3>Visitor Details</h3>
//                 <span className="close-button" onClick={() => setShowModal(false)}>
//                   &times;
//                 </span>
//               </div>
//               <div className="modal-body">
//                 {headers.map((key) => (
//                   <p key={key}>
//                     <strong>{key}:</strong> {selectedVisitor[key] || "N/A"}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Pagination Controls */}
//       <div className="pagination">
//         <span className="count">Page: {currentPage} of {totalPages}</span>
//         <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
//         <button className="active">{currentPage}</button>
//         <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
//       </div>
//     </>
//   );
// }


















import "./visitorbook.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VisitorToolbar from "../../Global/VisitorToolbar";
import { API_BASE_URL } from "../../../config";

export default function VisitorBook() {
  // 🔹 Define columns once (used for both toolbar & table)
const columns = [
  { key: "purpose", label: "PURPOSE" },
  { key: "meeting_with", label: "MEETING WITH" },
  { key: "visitor_name", label: "VISITOR NAME" },
  { key: "phone_number", label: "MOBILE" },   // 👈 change here
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
        const studentRes = await fetch(`${API_BASE_URL}/getvisitorStudent`);
        const studentData = await studentRes.json();
        const staffRes = await fetch(`${API_BASE_URL}/getvisitorStaff`);
        const staffData = await staffRes.json();

        setVisitors([...(studentData || []), ...(staffData || [])]);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }
    };
    fetchVisitors();
  }, []);

  const handleView = (visitor) => {
    setSelectedVisitor(visitor);
    setShowModal(true);
  };

  const handleEdit = async (visitor) => {
    const updatedName = prompt(
      "Edit visitor name:",
      visitor.visitor_name || visitor.staff || visitor.student
    );
    if (!updatedName?.trim()) return;

    try {
      const updatedVisitor = { ...visitor, visitor_name: updatedName };
      const response = await fetch(
        `${API_BASE_URL}/updateVisitor/${visitor.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedVisitor),
        }
      );
      if (!response.ok) throw new Error("Failed to update visitor");

      setVisitors((prev) =>
        prev.map((v) => (v.id === visitor.id ? updatedVisitor : v))
      );

      alert("Visitor updated successfully!");
    } catch (err) {
      console.error("Error updating visitor:", err);
      alert("Update failed!");
    }
  };

  const handleDelete = async (visitor) => {
    const name = visitor.visitor_name || visitor.staff || visitor.student;
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    const encodedName = encodeURIComponent(name);
    try {
      let response = await fetch(
        `${API_BASE_URL}/deletevistorStaff?visitor_name=${encodedName}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        response = await fetch(
          `${API_BASE_URL}/deletevistorStudent?visitor_name=${encodedName}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to delete visitor");
      }

      setVisitors((prev) =>
        prev.filter((v) => (v.visitor_name || v.staff || v.student) !== name)
      );

      alert("Visitor deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting visitor");
    }
  };

  // Pagination
  const totalPages = Math.ceil(visitors.length / visitorsPerPage);
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

  return (
    <>
      <div className="createbutton">
        <div className="leftvistor">Front Office → Visitor Book</div>
        <div
          className="rightvisitor"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {/* 🔹 Pass current page data + column config to toolbar */}
          <VisitorToolbar visitors={currentVisitors} columns={columns} />
          <button
            type="button"
            className="create"
            onClick={() => navigate("/createvisitor")}
          >
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
              {currentVisitors.map((visitor, index) => (
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
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1}>No visitor data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && selectedVisitor && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Visitor Details</h3>
                <span className="close-button" onClick={() => setShowModal(false)}>
                  &times;
                </span>
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

      {/* Pagination Controls */}
      <div className="pagination">
        <span className="count">Page: {currentPage} of {totalPages}</span>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        <button className="active">{currentPage}</button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </>
  );
}
