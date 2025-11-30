import React, { useState, useEffect, useCallback } from "react";
import "./frontSetup.css";
import "react-datepicker/dist/react-datepicker.css";
import VisitorToolbar from "../../Global/VisitorToolbar";
import { API_BASE_URL } from "../../../config.js";


const CustomAlert = ({ message, onClose, type = 'success' }) => {
  return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
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

const FrontOfficeSetUp = () => {
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
  const [activeTab, setActiveTab] = useState('PURPOSE');

  const getApiEndpoint = useCallback(() => {
    const endpoints = {
      'PURPOSE': 'addpurpose',
      'COMPLAINT TYPE': 'addcomplaint',
      'SOURCE': 'addsource',
      'REFERENCE': 'addreference'
    };
    return endpoints[activeTab];
  }, [activeTab]);

  const showCustomAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const handleView = (item) => {
    setSelectedEnquiry(item);
    setShowModal(true);
  };

  const fetchLogs = useCallback(() => {
    const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
    const endpoint = getApiEndpoint();
    fetch(`${apiUrl}/${endpoint}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Fetched data from /${endpoint}:`, data);
        setLogs(Array.isArray(data) ? data : data.data || []);  
      })
      .catch((err) => {
        console.error(`Error fetching ${endpoint} logs:`, err);
        setLogs([]);
      });
  }, [getApiEndpoint]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);


  const handleEdit = (item) => {
    const fieldMap = {
      'PURPOSE': 'purpose',
      'COMPLAINT TYPE': 'complain', 
      'SOURCE': 'source',
      'REFERENCE': 'reference'
    };
    const fieldName = item[fieldMap[activeTab]];
    
    setFormData({
      mainfield: fieldName,
      Description: item.description
    });
    setIsEditing(true);
    setEditingId(item.id);
  };

  // Filter based on search input (Reference No)
  const searchTerm = (formData.callSearch || "").toLowerCase();

  const filteredLogs = (logs || []).filter((log) => {
    const fieldMap = {
      'PURPOSE': 'purpose',
      'COMPLAINT TYPE': 'complain',
      'SOURCE': 'source',
      'REFERENCE': 'reference'
    };
    const fieldValue = log[fieldMap[activeTab]];
    return fieldValue?.toLowerCase().includes(searchTerm);
  });

  // Pagination logic after filtering
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

  const getFormElements = () => {
    const baseField = activeTab === 'PURPOSE' ? 'Purpose' : 
                     activeTab === 'COMPLAINT TYPE' ? 'Complaint Type' : 
                     activeTab === 'SOURCE' ? 'Source' : 'Reference';
    
    return [
      {
        id: "mainfield",
        label: baseField,
        type: "text",
        require: true,
      },
      {
        id: "Description",
        label: "Description",
        type: "textarea",
        require: false,
      }
    ];
  };

  const formElements = getFormElements();

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
    setConfirmMessage(`Are you sure you want to delete ${item.to_title}?`);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
      const endpoint = getApiEndpoint();
      const response = await fetch(
        `${apiUrl}/${endpoint}/${itemToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete dispatch");

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

    const fieldMap = {
      'PURPOSE': 'purpose',
      'COMPLAINT TYPE': 'complain',
      'SOURCE': 'source', 
      'REFERENCE': 'reference'
    };
    
    const payload = {
      [fieldMap[activeTab]]: formData.mainfield,
      description: formData.Description,
};

    console.log('Payload being sent:', payload);
    console.log('Active tab:', activeTab);
    console.log('Endpoint:', getApiEndpoint());


    try {
      const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
      const endpoint = getApiEndpoint();
      const url = isEditing ? `${apiUrl}/${endpoint}/${editingId}` : `${apiUrl}/${endpoint}`;
      const method = isEditing ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showCustomAlert(isEditing ? "Updated successfully!" : `${activeTab} saved successfully!`);
        setFormData({});
        setRemarksError({});
        setIsEditing(false);
        setEditingId(null);
        fetchLogs();
      } else {
        showCustomAlert(isEditing ? "Failed to update" : "Failed to save dispatch", 'error');
      }
    } catch (error) {
      console.error("Error saving dispatch:", error);
      showCustomAlert("An error occurred while saving dispatch", 'error');
    }
  };

  return (
  <>
    <div style={{margin : "2px 9px 2px 7px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      {['PURPOSE', 'COMPLAINT TYPE', 'SOURCE', 'REFERENCE'].map((tab) => (
        <button 
          key={tab}
          type="button" 
          className="frontSetup" 
          style={{
            marginRight: "0px",
            backgroundColor: activeTab === tab ? "#474849ff" : "transparent",
            color: activeTab === tab ? "white" : "black"
          }} 
          onClick={() => {
            setActiveTab(tab);
            setFormData({});
            setIsEditing(false);
            setEditingId(null);
            setCurrentPage(1);
          }}
        >
          {tab}
        </button>
      ))}
    </div>
    <div style={{ display: "flex" }}>
      {/* Left Section - Form */}
      <div className="leftCreatepostdispatch">
        <h5 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          {isEditing ? `EDIT ${activeTab}` : `ADD ${activeTab}`}
        </h5>
        <form>
          <div style={{}}>
          {formElements.map((item) => {
            if (item.type === "textarea") {
              return (
              <div key={item.id} className="roomtype-group-create">
                  <label htmlFor={item.id}>
                    {item.label}
                    {item.require && <span className="required">*</span>}
                  </label>
                  <textarea
                    id={item.id}
                    name={item.id}
                  className="roomtype-group-create-textarea"
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

           
            if (item.type === "text") {
              return (
              <div key={item.id} className="roomtype-group-create">
                  <label htmlFor={item.id}>
                    {item.label}
                    {item.require && <span className="required">*</span>}
                  </label>
                  <input
                    type="text"
                    id={item.id}
                    name={item.id}
                  className="roomtype-group-create-input"
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
                  className="call-group-create-inputs"
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
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
            <button
              onClick={handleSubmit}
              style={{
                fontSize: "14px",
                width: isEditing ? "44%" : "44%",
                height: "25px",
                padding: "0px",
                backgroundColor: isFormValid() ? "#474849ff" : "#ccc",
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
      <div style={{ flex: "3 1 0%", padding: "7px", borderRight: "1px solid rgb(204, 204, 204)", margin: "8px", boxShadow: "0 0 5px #ccc", borderRadius: "4px" }}>
       
        <h5 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          {activeTab} LIST
        </h5>

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
              fileName="Room_Type_Data"
              columns={[
                { key: {
                  'PURPOSE': 'purpose',
                  'COMPLAINT TYPE': 'complain',
                  'SOURCE': 'source',
                  'REFERENCE': 'reference'
                }[activeTab], label: activeTab },        
              ]}
              onAlert={showCustomAlert}
            />
          </div>
        </div>

        <div style={{ maxHeight: "450px", overflowY: "auto" }}>
          <table className="calltypeTable">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>{activeTab}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((log, index) => (
                <tr key={index}>
                  <td>{num++}</td>
                  <td>{log[{
                    'PURPOSE': 'purpose',
                    'COMPLAINT TYPE': 'complain',
                    'SOURCE': 'source',
                    'REFERENCE': 'reference'
                  }[activeTab]]}</td>
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
              <h3 style={{ margin: 0 }}>Postal Dispatch Details</h3>
            </div>
            <div>
              <p><strong>{activeTab}:</strong> {selectedEnquiry[{
                'PURPOSE': 'purpose',
                'COMPLAINT TYPE': 'complain',
                'SOURCE': 'source',
                'REFERENCE': 'reference'
              }[activeTab]] || "N/A"}</p>
              <p><strong>Description</strong> {selectedEnquiry.description || "N/A"}</p>
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
    </>
  );
};

export default FrontOfficeSetUp;
