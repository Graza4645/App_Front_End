
import React, { useState, useEffect } from "react";
import "./hostelroom.css";

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

const HostelRoom = () => {
  let num = 1;

  const [logs, setLogs] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hostels, setHostels] = useState([]);
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

  
  useEffect(() => {
    roomtypedropdown();
    hosteldropdown();
  }, []);

  const roomtypedropdown = () => {
    const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
    fetch(`${apiUrl}/room_type`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched room types:", data);
        setRoomTypes(Array.isArray(data) ? data : data.data || []);  
      })
      .catch((err) => {
        console.error("Error fetching room types:", err);
        setRoomTypes([]);
      });
  };

  const hosteldropdown = () => {
    const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
    fetch(`${apiUrl}/hostel`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched hostels:", data);
        setHostels(Array.isArray(data) ? data : data.data || []);  
      })
      .catch((err) => {
        console.error("Error fetching hostels:", err);
        setHostels([]);
      });
  };


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
    fetch(`${apiUrl}/hostal-room`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data from /hostal-room:", data);
        setLogs(Array.isArray(data) ? data : data.data || []);  
      })
      .catch((err) => {
        console.error("Error fetching hostel room logs:", err);
        setLogs([]);
      });
  };

  const handleEdit = (item) => {
    setFormData({
      'room Number / name': item.room_name,
      Hosteltype_hostelroom: item.hostel?.id,
      roomtype_hostelroom: item.room_type?.id,
      numberofbed: item.number_of_beds,
      costperbed: item.cost_per_bed,
      hostelroomdescription: item.description
    });
    setIsEditing(true);
    setEditingId(item.id);
  };

  // Filter based on search input (Reference No)
  const searchTerm = (formData.callSearch || "").toLowerCase();

  const filteredLogs = (logs || []).filter((log) => {
    // If no search term, show all records
    if (!searchTerm || searchTerm.trim() === "") {
      return true;
    }
    // Otherwise filter by room_name
    return log.room_name?.toLowerCase().includes(searchTerm);
  });

  // Pagination logic after filtering
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);


  console.log("filteredLogs:", filteredLogs);
  console.log("currentRecords:", currentRecords);
  console.log("searchTerm:", searchTerm);
  console.log("searchTerm length:", searchTerm.length);



  const formElements = [
    {
      id: "room Number / name",
      label: "Room Number / Name",
      type: "text",
      require: true,
    },
     {
      id: "Hosteltype_hostelroom",
      label: "Hostel",
      type: "dropdown",
      options: hostels,
      require: true,
    },
      {
      id: "roomtype_hostelroom",
      label: "Room Type",
      type: "dropdown",
      options: roomTypes,
      require: true,
    },
    {
      id: "numberofbed",
      label: "Number Of Bed",
      type: "text",
      require: true,
    },
    {
      id: "costperbed",
      label: "Cost Per Bed",
      type: "text",
      require: true,
    },
       {
      id: "hostelroomdescription",
      label: "Description",
      type: "textarea",
      require: false,
    }
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
    setConfirmMessage(`Are you sure you want to delete ${item.room_name}?`);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(
        `${apiUrl}/hostal-room/${itemToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete hostel room");

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
      room_name: formData['room Number / name'],
      hostel_id: parseInt(formData.Hosteltype_hostelroom),
      room_type_id: parseInt(formData.roomtype_hostelroom),
      number_of_beds: parseInt(formData.numberofbed),
      cost_per_bed: parseFloat(formData.costperbed),
      description: formData.hostelroomdescription,
    };

    console.log("Payload being sent:", payload);

    try {
      const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
      const url = isEditing ? `${apiUrl}/hostal-room/${editingId}` : `${apiUrl}/hostal-room`;
      const method = isEditing ? "PATCH" : "POST";
      
      console.log("API URL:", url);
      console.log("Method:", method);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const responseData = await response.text();
      console.log("Response data:", responseData);

      if (response.ok) {
        showCustomAlert(isEditing ? "Updated successfully!" : "Hostel Room saved successfully!");
        setFormData({});
        setRemarksError({});
        setIsEditing(false);
        setEditingId(null);
        fetchLogs();
      } else {
        showCustomAlert(`${isEditing ? "Failed to update" : "Failed to save hostel room"}: ${responseData}`, 'error');
      }
    } catch (error) {
      console.error("Error saving hostel room:", error);
      showCustomAlert("An error occurred while saving hostel room", 'error');
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Left Section - Form */}
      <div className="leftCreatepostdispatch">
        <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          {isEditing ? 'Edit Hostel Room' : 'Add Hostel Room'}
        </h4>
        <form>
          <div style={{}}>
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
            } if (item.type === "dropdown") {
              return (
                <div key={item.id} className="call-group-create">
                  <label htmlFor={item.id}>
                    {item.label}
                    {item.require && <span className="required">*</span>}
                  </label>
                  <select
                    id={item.id}
                    name={item.id}
                    value={formData[item.id] || ""}
                    className="call-group-create-input"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }));
                    }}
                  >
                   <option value="">Select</option>
                    {item.options?.map((option) => (
                    <option key={option.id} value={option.id}>
                        {item.id === 'Hosteltype_hostelroom' ? option.hostel_name : option.room_type}
                    </option>
                    ))}
                  </select>
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
       
        <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          Hostel Room List
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
              visitors={currentRecords.map(record => ({
                ...record,
                hostel_name: record.hostel?.hostel_name || 'N/A',
                room_type_name: record.room_type?.room_type || 'N/A'
              }))}
              fileName="Hostel_Room_Data"
              columns={[
                { key: "room_name", label: "ROOM NAME" },
                { key: "hostel_name", label: "HOSTEL" },
                { key: "room_type_name", label: "ROOM TYPE" },
                { key: "number_of_beds", label: "NO OF BEDS" },
                { key: "cost_per_bed", label: "COST PER BED" },
                { key: "description", label: "DESCRIPTION" }
              ]}
              onAlert={showCustomAlert}
            />
          </div>
        </div>

        <div style={{ maxHeight: "450px", overflowY: "auto" }}>
          <table className="postDispatch">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>ROOM NO NAME</th>
                <th>HOSTEL</th>
                <th>ROOM TYPE</th>
                <th>NO OF BED</th>
                <th>COST PER BED</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((log, index) => (
                <tr key={index}>
                  <td>{num++}</td>
                  <td>{log.room_name}</td>
                  <td>{log.hostel?.hostel_name || 'N/A'}</td>
                  <td>{log.room_type?.room_type || 'N/A'}</td>
                  <td>{log.number_of_beds}</td>
                  <td>{log.cost_per_bed}</td>
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
              <h3 style={{ margin: 0 }}>Hostel Room Details</h3>
            </div>
            <div>
              <p><strong>Room Name:</strong> {selectedEnquiry.room_name || "N/A"}</p>
              <p><strong>Hostel:</strong> {selectedEnquiry.hostel?.hostel_name || "N/A"}</p>
              <p><strong>Room Type:</strong> {selectedEnquiry.room_type?.room_type || "N/A"}</p>
              <p><strong>Number of Beds:</strong> {selectedEnquiry.number_of_beds || "N/A"}</p>
              <p><strong>Cost Per Bed:</strong> {selectedEnquiry.cost_per_bed || "N/A"}</p>
              <p><strong>Description:</strong> {selectedEnquiry.description || "N/A"}</p>
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



export default HostelRoom;

