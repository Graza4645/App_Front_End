import "./visitorbook.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function VisitorBook() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const visitorsPerPage = 20;

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const studentRes = await fetch(
          "http://localhost:3000/getvisitorStudent"
        );
        const studentData = await studentRes.json();
        const staffRes = await fetch("http://localhost:3000/getvisitorStaff");
        const staffData = await staffRes.json();
        const allVisitors = [...(studentData || []), ...(staffData || [])];
        setVisitors(allVisitors);
        
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      }
    };

    fetchVisitors();
  }, []);

  const handleDelete = async (visitor) => {
    const name = visitor.visitor_name || visitor.staff || visitor.student;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
    if (!confirmDelete) return;

    const encodedName = encodeURIComponent(name);

    try {
      let response = await fetch(
        `http://localhost:3000/deletevistorStaff?visitor_name=${encodedName}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        response = await fetch(
          `http://localhost:3000/deletevistorStudent?visitor_name=${encodedName}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok)
          throw new Error("Failed to delete visitor from both APIs");
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


  const handleCopy = () => {
  const exportData = normalizeData(visitors); // Already defined and used for Excel/CSV

  if (!exportData.length) {
    alert("No data to copy");
    return;
  }

  // Create a tab-separated string (or you can use commas for CSV)
  const headers = Object.keys(exportData[0]).join("\t");
  const rows = exportData.map(row => Object.values(row).join("\t"));
  const tsvContent = [headers, ...rows].join("\n");

  // Use Clipboard API to copy
  navigator.clipboard.writeText(tsvContent)
    .then(() => {
      alert("Visitor data copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy:", err);
      alert("Failed to copy visitor data.");
    });
};

  const handleEdit = async (visitor) => {
    const updatedName = prompt(
      "Edit visitor name:",
      visitor.visitor_name || visitor.staff || visitor.student
    );
    if (!updatedName || updatedName.trim() === "") return;

    try {
      const updatedVisitor = {
        ...visitor,
        visitor_name: updatedName,
      };

      const response = await fetch(
        `http://localhost:3000/updateVisitor/${visitor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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

  const normalizeData = (data) => {
    return data.map((visitor) => ({
      Purpose: visitor.purpose || "N/A",
      "Meeting With": visitor.meeting_with || visitor.meetingwith || "N/A",
      "Visitor Name":
        visitor.visitor_name || visitor.staff || visitor.student || "N/A",
      Phone: visitor.phone_number || visitor.phonenumber || "N/A",
      "ID Card": visitor.id_card || visitor.idcard || "N/A",
      "Number Of Person":
        visitor.number_of_person || visitor.numberofpersons || "N/A",
      Date: visitor.date || "N/A",
      "In Time": visitor.in_time || visitor.intime || "N/A",
      "Out Time": visitor.out_time || visitor.outtime || "N/A",
    }));
  };

  const handleExport = (type) => {
    const exportData = normalizeData(visitors);

    if (type === "excel" || type === "csv") {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");

      if (type === "csv") {
        XLSX.writeFile(workbook, "VisitorData.csv", { bookType: "csv" });
      } else {
        XLSX.writeFile(workbook, "VisitorData.xlsx", { bookType: "xlsx" });
      }
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("Visitor Data", 14, 15);
      const headers = [Object.keys(exportData[0] || {})];
      const body = exportData.map((row) => Object.values(row));
      autoTable(doc, {
        head: headers,
        body: body,
        startY: 20,
        styles: { fontSize: 8 },
      });
      doc.save("VisitorData.pdf");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Pagination logic
  const totalPages = Math.ceil(visitors.length / visitorsPerPage);
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = visitors.slice(
    indexOfFirstVisitor,
    indexOfLastVisitor
  );

  return (
    <>
      <div className="createbutton">
        <div className="leftvistor">Front Office → Visitor Book</div>
        <div className="rightvisitor">
          <div className="icon-toolbar">
           <span className="icon-container" onClick={handleCopy} title="Copy to Clipboard">
  <i className="fas fa-copy"></i>
  <span className="tooltip">Copy</span>
</span>
            <span
              className="icon-container"
              onClick={() => handleExport("excel")}
            >
              <i className="fas fa-file-excel"></i>
              <span className="tooltip">Excel</span>
            </span>
            <span
              className="icon-container"
              onClick={() => handleExport("csv")}
            >
              <i className="fas fa-file-csv"></i>
              <span className="tooltip">CSV</span>
            </span>
            <span
              className="icon-container"
              onClick={() => handleExport("pdf")}
            >
              <i className="fas fa-file-pdf"></i>
              <span className="tooltip">PDF</span>
            </span>
            <span className="icon-container" onClick={handlePrint}>
              <i className="fas fa-print"></i>
              <span className="tooltip">Print</span>
            </span>
            <button
              type="button"
              className="create"
              onClick={() => navigate("/createvisitor")}
            >
              Create New +
            </button>
          </div>
        </div>
      </div>

      <main>
        <div id="printArea" className="table-container">
          <table>
            <thead>
              <tr>
                <th>PURPOSE</th>
                <th>MEETING WITH</th>
                <th>VISITOR NAME</th>
                <th>PHONE</th>
                <th>ID CARD</th>
                <th>NUMBER OF PERSON</th>
                <th>DATE</th>
                <th>IN TIME</th>
                <th>OUT TIME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentVisitors.map((visitor, index) => (
                <tr key={index}>
                  <td>{visitor.purpose || "N/A"}</td>
                  <td>
                    {visitor.meeting_with || visitor.meetingwith || "N/A"}
                  </td>
                  <td>
                    {visitor.visitor_name ||
                      visitor.staff ||
                      visitor.student ||
                      "N/A"}
                  </td>
                  <td>
                    {visitor.phone_number || visitor.phonenumber || "N/A"}
                  </td>
                  <td>{visitor.id_card || visitor.idcard || "N/A"}</td>
                  <td>
                    {visitor.number_of_person ||
                      visitor.numberofpersons ||
                      "N/A"}
                  </td>
                  <td>{visitor.date || "N/A"}</td>
                  <td>{visitor.in_time || visitor.intime || "N/A"}</td>
                  <td>{visitor.out_time || visitor.outtime || "N/A"}</td>
                  <td>
                    <div className="action-menu">
                      <i className="fas fa-ellipsis-v"></i>
                      <div className="dropdown-content">
                        <div
                          className="edit"
                          onClick={() => handleEdit(visitor)}
                        >
                          Edit
                        </div>
                        <div
                          className="Delete"
                          onClick={() => handleDelete(visitor)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan="20">No visitor data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      {/* <div className='lower'> */}
      {/* <div className='count'></div> */}

      {/* Pagination Controls */}
      <div className="pagination">
        <span className="count">
          {" "}
          Page: {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <button className="active">{currentPage}</button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* </div> */}
    </>
  );
}
