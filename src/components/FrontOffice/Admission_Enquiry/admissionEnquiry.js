import React, { useState, useEffect } from "react";
import "./AdmissionEnquiry.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import VisitorToolbar from "../../Global/VisitorToolbar";
import { API_BASE_URL } from "../../../config.js";

const CustomAlert = ({ message, onClose, type = 'success' }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        minWidth: '300px'
      }}>
        <p style={{ margin: '0 0 15px 0', color: type === 'error' ? 'red' : 'green' }}>{message}</p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            padding: '0px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        minWidth: '300px'
      }}>
        <p style={{ margin: '0 0 20px 0' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={onCancel}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0px 32px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  
  let num = 1;

  const showCustomAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };
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

  const handleEdit = (item) => {
    navigate(`/admissionform?edit=${item.id}&data=${encodeURIComponent(JSON.stringify(item))}`);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setConfirmMessage(`Are you sure you want to delete ${item.name}?`);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL || 'http://localhost:8000/api/v1'}/admissionenquiry/${itemToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setEnquiries((prev) => prev.filter((e) => e.id !== itemToDelete.id));
      showCustomAlert("Deleted successfully!");
    } catch (err) {
      console.error(err);
      showCustomAlert("Failed to delete", 'error');
    } finally {
      setShowConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setItemToDelete(null);
  };

  // 🔍 This uses the search input correctly
  const searchTerm = searchQuery.toLowerCase();

  // ✅ First filter the full data
  const filteredLogs = enquiries.filter((log) =>
    log.name?.toLowerCase().includes(searchTerm)
  );

  // ✅ Then paginate the filtered results
  const recordsPerPage = 10
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
    disabled={!formData.Std || !formData.Source || !formData.EnquiryFromDate || !formData.EnquiryToDate || !formData.status}
    style={{opacity: (!formData.Std || !formData.Source || !formData.EnquiryFromDate || !formData.EnquiryToDate || !formData.status) ? 0.5 : 1}}
  
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
                Create
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
                <th>SL NO</th>
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
                    <td>{num++}</td>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.source}</td>
                    <td>{item.date}</td>
                    <td>{(() => {
                      const today = new Date();
                      const nextFollowUp = new Date(item.next_follow_up_date);
                      const enquiryDate = new Date(item.date);
                      
                      // Function to add business days (excluding Sundays)
                      const addBusinessDays = (date, days) => {
                        const result = new Date(date);
                        let businessDaysAdded = 0;
                        
                        while (businessDaysAdded < days) {
                          result.setDate(result.getDate() + 1);
                          // Count only non-Sunday days (Monday=1 to Saturday=6)
                          if (result.getDay() !== 0) {
                            businessDaysAdded++;
                          }
                        }
                        return result;
                      };
                      
                      // Function to subtract business days (excluding Sundays)
                      const subtractBusinessDays = (date, days) => {
                        const result = new Date(date);
                        let businessDaysSubtracted = 0;
                        
                        while (businessDaysSubtracted < days) {
                          result.setDate(result.getDate() - 1);
                          // Count only non-Sunday days (Monday=1 to Saturday=6)
                          if (result.getDay() !== 0) {
                            businessDaysSubtracted++;
                          }
                        }
                        return result;
                      };
                      
                      // Check if this is the first follow-up (5 business days from enquiry)
                      const firstFollowUp = addBusinessDays(enquiryDate, 5);
                      const isFirstFollowUp = Math.abs(nextFollowUp - firstFollowUp) < 24 * 60 * 60 * 1000; // Within 1 day tolerance
                      
                      if (isFirstFollowUp) {
                        return "-";
                      }
                      
                      // If next follow-up date has passed, show it as last follow-up
                      if (nextFollowUp < today) {
                        return item.next_follow_up_date;
                      }
                      
                      // Calculate previous follow-up date (5 business days before next)
                      const lastFollowUp = subtractBusinessDays(nextFollowUp, 5);
                      return lastFollowUp.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).replace(/ /g, '-');
                    })()}</td>
                    <td>{item.next_follow_up_date}</td>
                  <td style={{ color: "green", fontWeight: "600" }}>Active</td>
                    <td>
                      <div className="action-menu">
                        <i className="fas fa-ellipsis-v"></i>
                        <div className="dropdown-content">
                          <div className="view" onClick={() => handleView(item)}>View</div>
                          <div className="edit" style={{  }} onClick={() => handleEdit(item)}>Edit</div>
                          <div className="Delete" style={{}} onClick={() => handleDelete(item)}>Delete</div>
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
  <button className="close-btn-addmision" onClick={() => setShowModal(false)} style={{ color: 'wight', backgroundColor : 'red' }}>Close</button>
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
      {showAlert && (
        <CustomAlert 
          message={alertMessage} 
          type={alertType}
          onClose={() => setShowAlert(false)} 
        />
      )}
      {showConfirm && (
        <ConfirmDialog 
          message={confirmMessage}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default AdmissionEnquiry;
