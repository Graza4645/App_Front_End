import React, { useState ,useEffect} from "react";
import "./phonecall.css"; // Optional: Create this for styling
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../../config.js";

const PhoneCallLog = () => {
  
  // State variables
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  
  // Edit functionality state variables (similar to admission enquiry)
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleView = (item) => {
    alert(`Viewing: ${item.name}\nPhone: ${item.number}\nDate: ${item.date}`);
  };


useEffect(() => {
  fetchLogs();
}, []);

const fetchLogs = () => {
  const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
  fetch(`${apiUrl}/calllogs`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched call logs data:", data);
      setLogs(data.data || data || []);
    })
    .catch((err) => {
      console.error("Error fetching call logs:", err);
      setLogs([]);
    });
};

  // Edit function - directly populate form (different from admission enquiry since form is on same screen)
  const handleEdit = (item) => {
    // Directly populate form with item data
    setFormData({
      phoneName: item.name,
      phoneNumber: item.number,
      phonedate: item.date,
      callDescription: item.description,
      phonedatefollow: item.nextFollowUpDate || item.next_follow_up_date,
      phoneDuration: item.duration,
      callNote: item.note,
      callType: item.callType || item.call_type
    });
    // Set editing mode
    setIsEditing(true);
    setEditingId(item.id);
  };





// ✅ Filter based on search input (Reference No)
const searchTerm = (formData.callSearch || "").toLowerCase();

const filteredLogs = (logs || []).filter((log) =>
  log.name?.toLowerCase().includes(searchTerm)
);

// ✅ Pagination logic after filtering
const recordsPerPage = 10;
const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

  let num = 1;
    const formElement =[
      {
  
      id: "callSearch",
      label: "Search",
      type: "text",
      require: true,
  
      }
    ]


  const formElements = [
    {
      id: "phoneName",
      label: "Name",
      type: "text",
      require: true,
      placeholder : "Enter Name"
    },
    {
      id: "phoneNumber",
      label: "Number",
      type: "text",
      require: true,
      placeholder : "Enter Phone Number"
    },
    {
      id: "phonedate",
      label: "Date",
      type: "date",
      position: "left",
      require: true,
    },
    {
      id: "callDescription",
      label: "Description",
      type: "textarea",
      require: true,
      placeholder : "Write Your Call Description"
    },
       {
      id: "phonedatefollow",
      label: "Next Follow Up Date",
      type: "date",
      position: "left",
      require: true,
    },
    {
      id: "phoneDuration",
      label: "Duration HH:MM:SS",
      type: "text",
      require: true,
      placeholder : "Enter Duration"
    },

    {
      id: "callNote",
      label: "Note",
      type: "textarea",
      require: true,
      placeholder : "Write Your Note"
    },

  

    // {
    //   id: "MeetingWith",
    //   label: "Meeting With",
    //   type: "dropdown",
    //   options: ["Staff", "Student", "Parent"],
    //   position: "right",
    //   require: true,
    // },
  ];

  /**  -------------------------> start Name Validation   <------------------------------------- */
  const [nameError, setNameError] = useState("");
  const validateName = (value) => {
    if (!/^[a-zA-Z\s]*$/.test(value)) {
      setNameError("Name should contain only alphabets and spaces");
    } else {
      setNameError("");
    }
  };
  /**  -------------------------> End Name Validation   <------------------------------------- */


  /** ----------------------->  Start Mobile Validation  <-------------------------------  */
  const [phoneError, setPhoneError] = useState("");
  const validatePhone = (value) => {
    if (!/^[6-9]/.test(value)) {
      setPhoneError("Indian mobile number should start with 6, 7, 8, or 9");
    } else if (value.length !== 10) {
      setPhoneError("Mobile number should be exactly 10 digits");
    } else {
      setPhoneError("");
    }
  };
  /** ------------------------->  End Mobile Validation    <--------------------------------------  */



  /**  -------------------------> start TextArea Validation   <------------------------------------- */
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
  /**  -------------------------> End TextArea Validation   <------------------------------------- */

  /**  -------------------------> start Duration Validation   <------------------------------------- */
  const [NmberpersonErro, setNumberpersonError] = useState("");
const validatenumberperson = (value) => {
  // Regular expression for HH:MM:SS
  // HH: 00-23, MM: 00-59, SS: 00-59
  const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

  if (!regex.test(value)) {
    setNumberpersonError("Enter time in HH:MM:SS format (00:00:00 to 23:59:59)");
  } else {
    setNumberpersonError(""); // valid
  }
};


  /**  -------------------------> End Duration Validation   <------------------------------------- */


const isFormValid = () => {
  const requiredFields = formElements
    .filter((el) => el.require)
    .map((el) => el.id)
    .concat(["callType"]);

  const allFieldsFilled = requiredFields.every(
    (id) => formData[id] && formData[id].toString().trim() !== ""
  );

  const noErrors =
    nameError === "" &&
    phoneError === "" &&
    NmberpersonErro === "" &&
    Object.values(remarksError).every((err) => err === "");

  return allFieldsFilled && noErrors;
};


const handleDelete = async (item) => {
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
    const response = await fetch(`${apiUrl}/calllogs/${item.id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete call log");

    // Refresh the logs
    fetchLogs();
    alert("Deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to delete");
  }
};

// Handle form submission - supports both create and update (similar to admission enquiry)
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
    // Determine URL and method based on editing mode
    const url = isEditing ? `${apiUrl}/calllogs/${editingId}` : `${apiUrl}/calllogs`;
    const method = isEditing ? "PATCH" : "POST";
    
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.phoneName,
        number: formData.phoneNumber,
        date: formData.phonedate,
        description: formData.callDescription,
        nextFollowUpDate: formData.phonedatefollow,
        duration: formData.phoneDuration,
        note: formData.callNote,
        callType: formData.callType,
      }),
    });

    if (response.ok) {
      // Reset form and editing state
      setFormData({});
      setNameError("");
      setPhoneError("");
      setNumberpersonError("");
      setRemarksError({});
      setIsEditing(false);
      setEditingId(null);
      
      // No URL parameters to clear since form is on same screen
      
      fetchLogs(); // Refresh the list
      alert(isEditing ? "Updated successfully!" : "Saved successfully!");
    }

    const data = await response.json();
    console.log("Call log saved:", data);
  } catch (error) {
    console.error("Error saving call log:", error);
    alert("Error saving call log");
  }
};

  return (
    <div style={{ display: "flex" }}>
      {/* Left Section - Form */}
      <div style={{boxShadow: "0 0 5px #ccc" , margin: "7px" , borderRadius : "4px", }}>
      <div style={{ flex: 1, padding: "6px 2px 6px 7px", margin: "0px", boxShadow: "0 0 5px #ccc" , width : "220px"}}>
        {/* Dynamic title based on editing mode (similar to admission enquiry) */}
        <h4 style={{ padding: "0px", margin: "0px 0px 13px"  }}>
          {isEditing ? 'Edit Phone Call Log' : 'Add Phone Call Log'}
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
                    placeholder={item.placeholder}
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
                      color:
                        (formData[item.id]?.length || 0) > 300 ? "red" : "gray",
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

              // 📌 Format date as: 15-Aug-2025
              const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = date.toLocaleString("en-US", { month: "short" });
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
              };

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
                        setFormData((prev) => {
                          const newData = {
                            ...prev,
                            [item.id]: formatted,
                          };
                          
                          // Auto-calculate next follow-up date when call date is selected
                          if (item.id === "phonedate") {
                            const nextFollowUp = addBusinessDays(date, 5);
                            newData.phonedatefollow = formatDate(nextFollowUp);
                          }
                          
                          return newData;
                        });
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
                    value={formData[item.id] || ""} // step -1
                    placeholder={item.placeholder}
                    maxLength={
                      item.id === "phoneNumber"
                        ? 10
                        : item.id === "phoneDuration"
                        ? 10
                        : undefined
                    }
                   onChange={(e) => {
  let val = e.target.value;

  // ✅ Trigger validation if needed
  if (item.id === "phoneName") {
    validateName(val);
  }

  if (item.id === "phoneNumber") {
    validatePhone(val);
  }

  if (item.id === "phoneDuration") {
    validatenumberperson(val);
  }

  // ✅ Reset pagination when searching
  if (item.id === "callSearch") {
    setCurrentPage(1);
  }

  // ✅ Always update form data
  setFormData((prev) => ({
    ...prev,
    [item.id]: val,
  }));
}}

                  />

                  {/* ✅ ADDED: Show name error if any */}
                  {item.id === "phoneName" && nameError && (
                    <div className="error-message">{nameError}</div>
                  )}

                  {item.id === "phoneNumber" && phoneError && (
                    <div className="error-message">{phoneError}</div>
                  )}

                  {item.id === "phoneDuration" && NmberpersonErro && (
                    <div className="error-message">{NmberpersonErro}</div>
                  )}
                </div>
              );
            }

            return null;
          })}
          {/* <label style={{ fontSize: "14px", marginRight: "15px" }}>
            Call Type
          </label>
          <label style={{ fontSize: "14px", marginRight: "6px" }}>
            <input type="radio" name="callType" value="Incoming" /> Incoming
          </label>
          <label style={{ fontSize: "14px" }}>
            <input type="radio" name="callType" value="Outgoing" /> Outgoing
          </label> */}
          <div>
          <label style={{  fontSize: "small", marginRight: "6px" , color: "#333" }}>
  Call Type
</label>
</div>

<label style={{ fontSize: "small", marginRight: "6px" , color: "#333" }}>
  <input
    type="radio"
    name="callType"
    value="Incoming"
    checked={formData.callType === "Incoming"}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        callType: e.target.value,
      }))
    }
  />{" "}
  Incoming
</label>
<label style={{  fontSize: "small", marginRight: "6px" , color: "#333" }}>
  <input
    type="radio"
    name="callType"
    value="Outgoing"
    checked={formData.callType === "Outgoing"}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        callType: e.target.value,
      }))
    }
  />{" "}
  Outgoing
</label>


          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
           {/* Dynamic button text based on editing mode (similar to admission enquiry) */}
           <button
  onClick={handleSubmit}
  style={{
    fontSize: "14px",
    width: "44%",
    height: "25px",
    padding: "0px",
    backgroundColor: isFormValid() ? "#535557ff" : "#ccc",
    color: "white",
    border: "none",
    cursor: isFormValid() ? "pointer" : "not-allowed",
  }}
  disabled={!isFormValid()}
>
  {isEditing ? 'Update' : 'Save'}
</button>

{/* Cancel button - only show in edit mode (similar to admission enquiry) */}
{isEditing && (
  <button
    onClick={() => {
      // Reset form and exit edit mode
      setFormData({});
      setIsEditing(false);
      setEditingId(null);
      setNameError("");
      setPhoneError("");
      setNumberpersonError("");
      setRemarksError({});
      // Form is on same screen, no URL parameters to clear
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
      </div>

      {/* Right Section - Table */}
      <div style={{boxShadow: "0 0 5px #ccc" , margin: "7px" , borderRadius : "4px" ,width: "84%"}}>
      <div
        style={{
          flex: 3,
          padding: "7px",
          borderRight: "1px solid #ccc",
          margin: "0px",
        }}
      >
        <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          Phone Call Log List
        </h4>
        {/* <input
          type="text"
          placeholder="Search..."
          style={{ marginBottom: "10px", width: "20%" }}
        /> */}

        {formElement.map((item) => {
          if (item.id === "callSearch") {
            return (
              <div key={item.id} className="call-group-create">
                <label htmlFor={item.id}>
                  {item.label}
                  {item.require && <span className="required">*</span>}
                </label>
                <input
                  style={{ width: "20%" }}
                  type="text"
                  id={item.id}
                  name={item.id}
                  className="call-group-create-input"
                  value={formData[item.id] || ""}
                  onChange={(e) => {
                    let val = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      [item.id]: val,
                    }));
                  }}
                />
              </div>
            );
          }
          return null;
          // ...handle textarea and date types below
        })}
       <div style={{ maxHeight: "450px", overflowY: "auto" }}>
        <table border="0" cellPadding="10" cellSpacing="0" width="100%" className="enquiry-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Next Follow Up Date</th>
              <th>Call Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={{ border: "1px solid red" }}>
         {currentRecords.map((log, index) => (
              <tr key={index}>
                <td>{num++}</td>
                <td>{log.name}</td>
                <td>{log.number}</td>
                <td>{log.date}</td>
                <td>{log.nextFollowUpDate || log.next_follow_up_date || "-"}</td>
                <td>
                      <span
                        style={{
                          color: log.callType === "Incoming" ? "green" :
                                log.callType === "Outgoing" ? "red" :
                                "gray"
                        }}
                      >
                        {log.callType || log.call_type || "-"}
                      </span>
                    </td>
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
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
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
    </div>
  );
};

export default PhoneCallLog;
