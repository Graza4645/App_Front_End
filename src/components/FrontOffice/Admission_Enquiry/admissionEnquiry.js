import React, { useState, useEffect } from "react";
import "./AdmissionEnquiry.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import VisitorToolbar from "../../Global/VisitorToolbar";
import { API_BASE_URL } from "../../../config.js";

const AdmissionEnquiry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Std: "",
    Source: "",
    EnquiryFromDate: null, //new Date(),
    EnquiryToDate: null, //new Date(),
    status: "",
  });

  const [enquiries, setEnquiries] = useState([]);
  const [originalEnquiries, setOriginalEnquiries] = useState([]);
  useEffect(() => {
    const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
    console.log('API URL => ', apiUrl)

    fetch(`${apiUrl}/admissionenquiry`)
      .then((res) => res.json())
      .then((data) => {
        setEnquiries(data);
        setOriginalEnquiries(data);
      })
      .catch((err) => {
        console.error("Failed to fetch enquiries:", err);
      });
  }, []);
  /**  Starting */
  const formElements = [
    {
      id: "Std",
      label: "Class",
      type: "dropdown",
      options: [
        "Nursery",
        "LKG",
        "UKG",
        "Class 1",
        "Class 2",
        "Class 3",
        "Class 4",
        "Class 5",
        "Class 6",
        "Class 7",
        "Class 8",
        "Class 9",
        "Class 10",
        "Class 11 - Science",
        "Class 11 - Commerce",
        "Class 11 - Arts",
        "Class 12 - Science",
        "Class 12 - Commerce",
        "Class 12 - Arts",
        "B.A.",
        "B.Sc.",
        "B.Com.",
        "B.Tech",
        "BBA",
        "BCA",
        "M.A.",
        "M.Sc.",
        "M.Com.",
        "M.Tech",
        "MBA",
        "MCA",
      ],
      require: true,
    },

    {
      id: "Source",
      label: "Source",
      type: "dropdown",
      require: true,
      options: [
        "Advertisement",
        "Online Front Site",
        "Google Ads",
        "Admission Campaign",
        "Front Office",
        "parents",
        "Student",
        "Walk-in"
      ],
    },
    {
      id: "EnquiryFromDate",
      label: "Enquiry From Date",
      type: "date",
      position: "left",
      require: true,
    },
    {
      id: "EnquiryToDate",
      label: "Last Follow Up Date",
      type: "date",
      position: "left",
      require: true,
    },
    {
      id: "status",
      label: "Status",
      type: "dropdown",
      options: ["All", "Active", "Passive", "Dead", "Won", "Lost"],
      position: "left",
      require: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (item) => {
    setSelectedEnquiry(item);
    setShowModal(true);
  };

  const handleEdit = async (item) => {
    const updatedName = prompt("Edit Name", item.name);
    if (!updatedName || updatedName.trim() === "") return;

    try {
      const response = await fetch(
        `${API_BASE_URL || 'http://localhost:8000/api/v1'}/updateadmission/${item.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, name: updatedName }),
        }
      );

      if (!response.ok) throw new Error("Failed to update admission");

      setEnquiries((prev) =>
        prev.map((e) => (e.id === item.id ? { ...item, name: updatedName } : e))
      );

      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(`Delete ${item.name}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL || 'http://localhost:8000/api/v1'}/admissionenquiry/${item.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setEnquiries((prev) => prev.filter((e) => e.id !== item.id));
      alert("Deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  // 🔍 This uses the search input correctly
  const searchTerm = searchQuery.toLowerCase();

  // ✅ First filter the full data
  const filteredLogs = enquiries.filter((log) =>
    log.name?.toLowerCase().includes(searchTerm)
  );

  // ✅ Then paginate the filtered results
  const recordsPerPage = 7;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredLogs.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Search triggered with:", formData);
    
    let filtered = originalEnquiries;
    
    if (formData.Std) {
      filtered = filtered.filter(item => item.class === formData.Std);
    }
    
    if (formData.Source) {
      filtered = filtered.filter(item => item.source === formData.Source);
    }
    
    if (formData.EnquiryFromDate && formData.EnquiryToDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(formData.EnquiryFromDate);
        const toDate = new Date(formData.EnquiryToDate);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    
    // Last Follow Up Date filter
    if (formData.EnquiryToDate) {
      filtered = filtered.filter(item => {
        const lastFollowUpDate = new Date(item.next_follow_up_date);
        const toDate = new Date(formData.EnquiryToDate);
        // const status = item.status || 'Active'; // Use dummy Active status if not present
        return lastFollowUpDate <= toDate;
      });
    }
    
    if (formData.status && formData.status !== 'All') {
      filtered = filtered.filter(item => item.status === formData.status);
    }
    
    setEnquiries(filtered);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="admission-enquiry-wrapper">
        <div className="filter-section">
          <h4 className="admissioncriteria" style={{ margin: "4px 0" }}>
            Select Criteria
          </h4>

          <div className="form-row">
            {formElements.map((item) => {
              const value = formData[item.id] || "";

              if (
                item.id === "Std" ||
                item.id === "Source" ||
                item.id === "status"
              ) {
                return (
                  <div key={item.id} className="addmisson-group">
                    <label htmlFor={item.id}>
                      {item.label}
                      {item.require && <span className="required">*</span>}
                    </label>
                    <select
                      id={item.id}
                      name={item.id}
                      value={value}
                      className="dropdown-admission"
                      onChange={(e) => handleChange(item.id, e.target.value)}
                    >
                      <option value="">Select {item.label}</option>
                      {item.options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (item.type === "date") {
                const today = new Date();
                const oneYearBack = new Date(today);
                oneYearBack.setFullYear(today.getFullYear() - 1);

                const oneYearAhead = new Date(today);
                oneYearAhead.setFullYear(today.getFullYear() + 1);

                // 📌 Format date as: 15-Aug-2025
                const formatDate = (date) => {
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = date.toLocaleString("en-US", {
                    month: "short",
                  });
                  const year = date.getFullYear();
                  return `${day}-${month}-${year}`;
                };

                return (
                  <div key={item.id} className="addmisson-group" >
                    <label htmlFor={item.id}>
                      {item.label}
                      {item.require && <span className="required">*</span>}
                    </label>
                    <div className="datepicker-wrapper-admission">
                      <DatePicker
                        id={item.id}
                        selected={
                          formData[item.id] ? new Date(formData[item.id]) : null
                        }
                        onChange={(date) => {
                          const formatted = formatDate(date);
                          handleChange(item.id, formatted);
                        }}
                        minDate={oneYearBack}
                        maxDate={oneYearAhead}
                        placeholderText="Select Date"
                        dateFormat="dd-MMM-yyyy"
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          
        <div className="addmission-groups">
  <button 
    onClick={handleSearch} 
    className="search-btns"
    disabled={!formData.Std || !formData.Source || !formData.EnquiryFromDate || !formData.EnquiryToDate || !formData.status}
    style={{opacity: (!formData.Std || !formData.Source || !formData.EnquiryFromDate || !formData.EnquiryToDate || !formData.status) ? 0.5 : 1}}
  >
    Search
  </button>

  <button
    onClick={() => {
      setFormData({
        Std: "",
        Source: "",
        EnquiryFromDate: null,
        EnquiryToDate: null,
        status: "",
      });
      setEnquiries(originalEnquiries);
      setCurrentPage(1);
    }}
    className="search-btns"
  >
    Reset
  </button>
</div>

        </div>

        <div className="table-section">
          <div className="table-header">
            <h4 className="admissioncriteria" style={{ margin: "4px 0" }}>
              Admission Enquiry
            </h4>

            <div className="right-actions">
              <input
                type="text"
                placeholder="Search..." //🔎
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button
                className="add-btn"
                onClick={() => navigate("/admissionform")}
              >
                Create +
              </button>
            </div>
          </div>
          <div
            className="rightvisitor"
            style={{ display: "flex", justifyContent: "end", gap: "10px" }}
          >
           <VisitorToolbar
  visitors={currentRecords}
  fileName="Admission_Enquiry_Data"
  columns={[
    { key: "name", label: "NAME" },
    { key: "phone", label: "PHONE" },
    { key: "source", label: "SOURCE" },
    { key: "date", label: "ENQUIRY DATE" },
    { key: "date", label: "LAST FOLLOW UP DATE" },
    { key: "next_follow_up_date", label: "NEXT FOLLOW UP DATE" },
    { key: "Active", label: "STATUS" }
  ]}
/>
          </div>

          <table className="enquiry-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>PHONE</th>
                <th>SOURCE</th>
                <th>ENQUIRY DATE</th>
                <th>LAST FOLLOW UP DATE</th>
                <th>NEXT FOLLOW UP DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    <div className="no-data-img" />
                    <div>No data available in table</div>
                    <p>↩ Add new record or search with different criteria.</p>
                  </td>
                </tr>
              ) : (
                currentRecords.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.source}</td>
                    <td>{item.date}</td>
                    <td>{item.date}</td>
                    <td>{item.next_follow_up_date}</td>
                  <td style={{ color: "green", fontWeight: "600" }}>Active</td>
                    <td>
                      <div className="action-menu">
                        <i className="fas fa-ellipsis-v"></i>
                        <div className="dropdown-content">
                          <div
                            className="view"
                            onClick={() => handleView(item)}
                          >
                            View
                          </div>
                          <div
                            className="edit" style={{ color: "#1E88E5" }}
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </div>
                          <div
                            className="delete" style={{color : "red"}}
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedEnquiry && (
        <div className="modal-overlay">
          <div className="modal-content" style={{backgroundColor: 'white', color: 'black', width: '500px', maxWidth: '90vw', padding: '20px', borderRadius: '8px', maxHeight: '80vh', overflowY: 'auto'}}>
            <h3 style={{color: 'black', fontSize: '18px', marginBottom: '15px'}}>Enquiry Details</h3>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Name:</strong> {selectedEnquiry.name}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Phone:</strong> {selectedEnquiry.phone}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Email:</strong> {selectedEnquiry.email}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Address:</strong> {selectedEnquiry.address}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Class:</strong> {selectedEnquiry.class}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Source:</strong> {selectedEnquiry.source}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Reference:</strong> {selectedEnquiry.reference}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Enquiry Date:</strong> {selectedEnquiry.date}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Next Follow Up:</strong> {selectedEnquiry.next_follow_up_date}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Assigned:</strong> {selectedEnquiry.assigned}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Number of Children:</strong> {selectedEnquiry.number_of_child}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Description:</strong> {selectedEnquiry.description}</p>
            <p style={{color: 'black', fontSize: '14px', margin: '5px 0'}}><strong>Note:</strong> {selectedEnquiry.note}</p>
            
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
  <button className="close-btn-addmision" onClick={() => setShowModal(false)} style={{ color: 'black' }}>Close</button>
</div>

          </div>
        </div>
      )}

      <div className="pagination">
        <span className="count">
          Page: {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <button className="active">{currentPage}</button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default AdmissionEnquiry;
