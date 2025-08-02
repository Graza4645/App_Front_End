import React, { useState ,useEffect} from "react";
import "./phonecall.css"; // Optional: Create this for styling
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PhoneCallLog = () => {
  
 


const [logs, setLogs] = useState([]);

useEffect(() => {
  fetch("http://localhost:3000") // <-- replace with your real API URL
    .then((res) => res.json())
    .then((data) => setLogs(data))
    .catch((err) => console.error("Error fetching call logs:", err));
}, []);


  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = logs.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(logs.length / recordsPerPage);



  




  const formElements = [
    {
      id: "phoneName",
      label: "Name",
      type: "text",
      require: true,
    },
    {
      id: "phoneNumber",
      label: "Number",
      type: "text",
      require: true,
    },
    {
      id: "phonedate",
      label: "Next Follow Up Date",
      type: "date",
      position: "left",
      require: true,
    },
    {
      id: "callDescription",
      label: "Description",
      type: "textarea",
      require: true,
    },
    {
      id: "phoneDuration",
      label: "Duration",
      type: "text",
      require: true,
    },

    {
      id: "callNote",
      label: "Note",
      type: "textarea",
      require: true,
    },

    {
      id: "callSearch",
      label: "Search",
      type: "text",
      require: true,
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
    const number = parseInt(value, 10);

    if (isNaN(number) || number < 0 || number >= 200) {
      setNumberpersonError("Enter a number between 0 and 199");
    } else {
      setNumberpersonError("");
    }
  };

  /**  -------------------------> End Duration Validation   <------------------------------------- */

  return (
    <div style={{ display: "flex" }}>
      {/* Left Section - Form */}
      <div
        style={{
          flex: 1,
          padding: "7px",
          borderRight: "1px solid #ccc",
          margin: "0px",
        }}
      >
        <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
          Add Phone Call Log
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
                    value={formData[item.id] || ""} // step -1
                    maxLength={
                      item.id === "phoneNumber"
                        ? 10
                        : item.id === "phoneDuration"
                        ? 10
                        : undefined
                    }
                    onChange={(e) => {
                      let val = e.target.value;

                      if (item.id === "phoneName") {
                        validateName(val);
                      }

                      if (item.id === "phoneNumber") {
                        validatePhone(val);
                      }

                      if (item.id === "phoneDuration") {
                        validatenumberperson(val);
                      }
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

          <label style={{ fontSize: "14px", marginRight: "15px" }}>
  Call Type
</label>
<label style={{ fontSize: "14px", marginRight: "6px" }}>
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
<label style={{ fontSize: "14px" }}>
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
            <button
              style={{
                fontSize: "14px",
                width: "93%",
                height: "25px",
                padding: "0px",
              }}
            >
              Save
            </button>
          </div>
        </form>

        {/* <div>
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Phone *</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label>Date *</label>
            <input name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <label>Next Follow Up Date</label>
            <input name="nextFollowUpDate" value={formData.nextFollowUpDate} onChange={handleChange} />
          </div>
          <div>
            <label>Call Duration</label>
            <input name="callDuration" value={formData.callDuration} onChange={handleChange} />
          </div>
          <div>
            <label>Note</label>
            <textarea name="note" value={formData.note} onChange={handleChange} />
          </div>
          <div>
            <label>Call Type *</label><br />
            <label>
              <input
                type="radio"
                name="callType"
                value="Incoming"
                checked={formData.callType === 'Incoming'}
                onChange={handleChange}
              />
              Incoming
            </label>
            <label style={{ marginLeft: '20px' }}>
              <input
                type="radio"
                name="callType"
                value="Outgoing"
                checked={formData.callType === 'Outgoing'}
                onChange={handleChange}
              />
              Outgoing
            </label>
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>Save</button>
        </form> */}
      </div>

      {/* Right Section - Table */}
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

        {formElements.map((item) => {
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
       <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <table border="0" cellPadding="10" cellSpacing="0" width="100%" className="enquiry-table">
          <thead>
            <tr>
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
                <td>{log.name}</td>
                <td>{log.phone}</td>
                <td>{log.date}</td>
                <td>{log.nextFollowUpDate || "-"}</td>
                <td>
                  <strong>{log.callType}</strong>
                </td>
                <td>
                  <button>Edit</button>
                  <button style={{ marginLeft: "5px" }}>Delete</button>
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
      </div>
    </div>
  );
};

export default PhoneCallLog;
