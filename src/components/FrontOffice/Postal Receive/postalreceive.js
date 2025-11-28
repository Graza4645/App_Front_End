import React, { useState, useEffect } from "react";
import "./postalreceive.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
            padding: '0px 27px',
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

const PostalReceive = () => {
  let num = 1;

  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const showCustomAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const handleView = (item) => {
    setSelectedEnquiry(item);
    setShowModal(true);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
    fetch(`${apiUrl}/postalreceive`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data from /postalreceive:", data);
        setLogs(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching postal receive logs:", err);
        setLogs([]);
      });
  };

  const handleEdit = (item) => {
    setFormData({
      fromtitaldispatch: item.from_title,
      refrenecereceive: item.reference_no,
      addressreceive: item.address,
      notereceive: item.note,
      totitelreceive: item.to_title,
      receviedate: item.date,
      fileUpload: item.upload_documents
    });
    setIsEditing(true);
    setEditingId(item.id);
  };

  // Filter based on search input (Reference No)
  const searchTerm = (formData.callSearch || "").toLowerCase();

  const filteredLogs = logs.filter((log) =>
    log.reference_no?.toLowerCase().includes(searchTerm)
  );

  // Pagination logic after filtering
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

  const formElements = [
    {
      id: "fromtitaldispatch",
      label: "From Title",
      type: "text",
      require: true,
    },
    {
      id: "refrenecereceive",
      label: "Reference No",
      type: "text",
      require: true,
    },
    {
      id: "addressreceive",
      label: "Address",
      type: "textarea",
      require: true,
    },
    {
      id: "notereceive",
      label: "Note",
      type: "textarea",
      require: true,
    },
    {
      id: "totitelreceive",
      label: "To Title",
      type: "text",
      require: true,
    },
    {
      id: "receviedate",
      label: "Date",
      type: "date",
      position: "left",
      require: true,
    },
    {
      id: "fileUpload",
      label: "Upload Documents",
      type: "file",
      position: "right",
      require: true,
    },
  ];

  const [remarksError, setRemarksError] = useState({});
  const validateTextarea = (id, value) => {
    if (value.length > 299) {
      setRemarksError((prev) => ({
        ...prev,
        [id]: "Maximum 300 characters allowed.",
      }));
    } else {
      setRemarksError((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setConfirmMessage(`Are you sure you want to delete ${item.from_title}?`);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(
        `${apiUrl}/postalreceive/${itemToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete postal receive");

      fetchLogs();
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

  const isFormValid = () => {
    const requiredFields = formElements
      .filter((el) => el.require)
      .map((el) => el.id);

    const allFieldsFilled = requiredFields.every(
      (id) => formData[id] && formData[id].toString().trim() !== ""
    );

    const noErrors = Object.values(remarksError).every((err) => err === "");

    return allFieldsFilled && noErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      from_title: formData.fromtitaldispatch,
      reference_no: formData.refrenecereceive,
      address: formData.addressreceive,
      note: formData.notereceive,
      to_title: formData.totitelreceive,
      date: formData.receviedate,
      upload_documents: formData.fileUpload || "",
    };

    try {
      const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
      const url = isEditing ? `${apiUrl}/postalreceive/${editingId}` : `${apiUrl}/postalreceive`;
      const method = isEditing ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showCustomAlert(isEditing ? "Updated successfully!" : "Postal receive saved successfully!");
        setFormData({});
        setRemarksError({});
        setIsEditing(false);
        setEditingId(null);
        fetchLogs();
      } else {
        showCustomAlert(isEditing ? "Failed to update" : "Failed to save postal receive", 'error');
      }
    } catch (error) {
      console.error("Error saving postal receive:", error);
      showCustomAlert("An error occurred while saving postal receive", 'error');
    }
  };

  return (
    <div style={{ display: "flex" , height: "100%"}}>
      {/* Left Section - Form */}
      <div style={{ flex: 1, padding: "7px", borderRight: "1px solid #ccc", margin: "8px", boxShadow: "0 0 5px #ccc", borderRadius: "4px"}}>
        <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          {isEditing ? 'Edit Postal Receive' : 'Add Postal Receive'}
        </h4>
        <form>
          {formElements.map((item) => {
            if (item.type === "textarea") {
              return (
                <div key={item.id} className="call-group-create">
                  <label htmlFor={item.id}>
                    {item.label}
                    {item.require && <span className="required">*</span>}
                  </label>
                  <textarea
                    id={item.id}
                    name={item.id}
                    className="call-group-create-textarea"
                    value={formData[item.id] || ""}
                    maxLength={300}
                    onChange={(e) => {
                      const val = e.target.value;
                      validateTextarea(item.id, val);
                      setFormData((prev) => ({
                        ...prev,
                        [item.id]: val,
                      }));
                    }}
                  />
                  {remarksError[item.id] && (
                    <div className="error-message">{remarksError[item.id]}</div>
                  )}
                  <div
                    className="char-count"
                    style={{
                      fontSize: "10px",
                      color: (formData[item.id]?.length || 0) > 300 ? "red" : "gray",
                    }}
                  >
                    {formData[item.id]?.length || 0}/300
                  </div>
                </div>
              );
            }

            if (item.type === "date") {
              const today = new Date();
              const oneYearBack = new Date(today);
              oneYearBack.setFullYear(today.getFullYear() - 1);

              const oneYearAhead = new Date(today);
              oneYearAhead.setFullYear(today.getFullYear() + 1);

              const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = date.toLocaleString("en-US", { month: "short" });
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
              };

              return (
                <div key={item.id} className="call-group-create">
                  <label htmlFor={item.id}>
                    {item.label}
                    {item.require && <span className="required">*</span>}
                  </label>
                  <div className="call-group-create-date">
                    <DatePicker
                      id={item.id}
                      selected={
                        formData[item.id] ? new Date(formData[item.id]) : null
                      }
                      onChange={(date) => {
                        const formatted = formatDate(date);
                        setFormData((prev) => ({
                          ...prev,
                          [item.id]: formatted,
                        }));
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

            if (item.type === "text") {
              return (
                <div key={item.id} className="call-group-create">
                  <label htmlFor={item.id}>
                    {item.label}
                    {item.require && <span className="required">*</span>}
                  </label>
                  <input
                    type="text"
                    id={item.id}
                    name={item.id}
                    className="call-group-create-input"
                    value={formData[item.id] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        [item.id]: val,
                      }));
                    }}
                  />
                </div>
              );
            }

            if (item.type === "file") {
              return (
                <div key={item.id} className="call-group-create">
                  <label htmlFor={item.id}>
                    {item.label}
                    {item.require && <span className="required">*</span>}
                  </label>
                  <input
                    type="file"
                    id={item.id}
                    name={item.id}
                    className="call-group-create-inputss"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData((prev) => ({
                        ...prev,
                        [item.id]: file ? file.name : "",
                      }));
                    }}
                  />
                </div>
              );
            }

            return null;
          })}

          <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
            <button
              onClick={handleSubmit}
              style={{
                fontSize: "14px",
                width: isEditing ? "44%" : "44%",
                height: "25px",
                padding: "0px",
                backgroundColor: isFormValid() ? "#5d5d5eff" : "#ccc",
                color: "white",
                border: "none",
                cursor: isFormValid() ? "pointer" : "not-allowed",
              }}
              disabled={!isFormValid()}
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setFormData({});
                  setIsEditing(false);
                  setEditingId(null);
                  setRemarksError({});
                }}
                style={{
                  fontSize: "14px",
                  width: "44%",
                  height: "25px",
                  padding: "0px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "10px"
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right Section - Table */}
      <div style={{ flex: 3, padding: "7px", borderRight: "1px solid #ccc",margin: "8px", boxShadow: "0 0 5px #ccc", borderRadius: "4px"}}>
        <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          Postal Receive List
        </h4>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="text"
              placeholder="Search..."
              style={{ 
                padding: "5px", 
                borderRadius: "4px", 
                border: "1px solid #ccc", 
                width: "180px",
                height: "26px"
              }}
              value={formData.callSearch || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  callSearch: e.target.value,
                }));
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <VisitorToolbar 
              visitors={currentRecords} 
              fileName="Postal_Receive_Data"
              columns={[
                { key: "from_title", label: "FROM TITLE" },
                { key: "reference_no", label: "REFERENCE NO" },
                { key: "address", label: "ADDRESS" },
                { key: "to_title", label: "TO TITLE" },
                { key: "date", label: "DATE" }
              ]} 
            />
          </div>
        </div>

        <div style={{ maxHeight: "450px", overflowY: "auto" }}>
          <table className="postalrecivetable">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>From Title</th>
                <th>Reference No</th>
                <th>Address</th>
                <th>To Title</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((log, index) => (
                <tr key={index}>
                  <td>{num++}</td>
                  <td>{log.from_title}</td>
                  <td>{log.reference_no}</td>
                  <td>{log.address}</td>
                  <td>{log.to_title}</td>
                  <td>{log.date || "-"}</td>
                  <td>
                    <div className="action-menu">
                      <i className="fas fa-ellipsis-v"></i>
                      <div className="dropdown-content">
                        <div className="view" onClick={() => handleView(log)}>View</div>
                        <div className="edit" onClick={() => handleEdit(log)}>Edit</div>
                        <div className="delete" onClick={() => handleDelete(log)}>Delete</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination" style={{ marginTop: "10px" }}>
          <span>Page: {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button className="active">{currentPage}</button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedEnquiry && (
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
            minWidth: '400px',
            maxWidth: '500px'
          }}>
            <div style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '15px'
            }}>
              <h3 style={{ margin: 0 }}>Postal Receive Details</h3>
            </div>
            <div>
              <p><strong>From Title:</strong> {selectedEnquiry.from_title || "N/A"}</p>
              <p><strong>Reference No:</strong> {selectedEnquiry.reference_no || "N/A"}</p>
              <p><strong>Address:</strong> {selectedEnquiry.address || "N/A"}</p>
              <p><strong>Note:</strong> {selectedEnquiry.note || "N/A"}</p>
              <p><strong>To Title:</strong> {selectedEnquiry.to_title || "N/A"}</p>
              <p><strong>Date:</strong> {selectedEnquiry.date || "N/A"}</p>
              <p><strong>Upload Documents:</strong> {selectedEnquiry.upload_documents || "N/A"}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                display: "block",
                margin: "20px auto 0",
                padding: "8px 16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default PostalReceive;