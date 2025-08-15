// import React, { useState ,useEffect} from "react";
// import "./phonecall.css"; // Optional: Create this for styling
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const PhoneCallLog = () => {
  
//  const [selectedEnquiry, setSelectedEnquiry] = useState(null);


  

// const [logs, setLogs] = useState([]);
// const handleView = (item) => {
//   setSelectedEnquiry(item);
//   setShowModal(true);
// };
//   const [currentPage, setCurrentPage] = useState(1);
//   const [formData, setFormData] = useState({});
// const [showModal, setShowModal] = useState(false);

// useEffect(() => {
//   fetchLogs();
// }, []);

// const fetchLogs = () => {
//   fetch("http://localhost:3000/getcallogs")
//     .then((res) => res.json())
//     .then((data) => setLogs(data.data))
//     .catch((err) => console.error("Error fetching call logs:", err));
// };


// const handleEdit = async (item) => {
//   const updatedName = prompt("Edit Name", item.name);
//   if (!updatedName || updatedName.trim() === "") return;

//   try {
//     const response = await fetch(`http://localhost:3000/updateadmission/${item.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...item, name: updatedName }),
//     });

//     if (!response.ok) throw new Error("Failed to update admission");

//   setLogs((prev) =>
//   prev.map((e) => (e.id === item.id ? { ...item, name: updatedName } : e))
// );

//     alert("Updated successfully!");
//   } catch (err) {
//     console.error(err);
//     alert("Failed to update");
//   }
// };



// // ✅ Filter based on search input (Reference No)
// const searchTerm = (formData.callSearch || "").toLowerCase();

// const filteredLogs = logs.filter((log) =>
//   log.name?.toLowerCase().includes(searchTerm)
// );

// // ✅ Pagination logic after filtering
// const recordsPerPage = 10;
// const indexOfLastRecord = currentPage * recordsPerPage;
// const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
// const currentRecords = filteredLogs.slice(indexOfFirstRecord, indexOfLastRecord);
// const totalPages = Math.ceil(filteredLogs.length / recordsPerPage);

//   let num = 1;
//     const formElement =[
//       {
  
//       id: "callSearch",
//       label: "Search",
//       type: "text",
//       require: true,
  
//       }
//     ]


//   const formElements = [
//     {
//       id: "phoneName",
//       label: "Name",
//       type: "text",
//       require: true,
//     },
//     {
//       id: "phoneNumber",
//       label: "Number",
//       type: "text",
//       require: true,
//     },
//     {
//       id: "phonedate",
//       label: "Date",
//       type: "date",
//       position: "left",
//       require: true,
//     },
//     {
//       id: "callDescription",
//       label: "Description",
//       type: "textarea",
//       require: true,
//     },
//        {
//       id: "phonedatefollow",
//       label: "Next Follow Up Date",
//       type: "date",
//       position: "left",
//       require: true,
//     },
//     {
//       id: "phoneDuration",
//       label: "Duration",
//       type: "text",
//       require: true,
//     },

//     {
//       id: "callNote",
//       label: "Note",
//       type: "textarea",
//       require: true,
//     },

  

//     // {
//     //   id: "MeetingWith",
//     //   label: "Meeting With",
//     //   type: "dropdown",
//     //   options: ["Staff", "Student", "Parent"],
//     //   position: "right",
//     //   require: true,
//     // },
//   ];

//   /**  -------------------------> start Name Validation   <------------------------------------- */
//   const [nameError, setNameError] = useState("");
//   const validateName = (value) => {
//     if (!/^[a-zA-Z\s]*$/.test(value)) {
//       setNameError("Name should contain only alphabets and spaces");
//     } else {
//       setNameError("");
//     }
//   };
//   /**  -------------------------> End Name Validation   <------------------------------------- */


//   /** ----------------------->  Start Mobile Validation  <-------------------------------  */
//   const [phoneError, setPhoneError] = useState("");
//   const validatePhone = (value) => {
//     if (!/^[6-9]/.test(value)) {
//       setPhoneError("Indian mobile number should start with 6, 7, 8, or 9");
//     } else if (value.length !== 10) {
//       setPhoneError("Mobile number should be exactly 10 digits");
//     } else {
//       setPhoneError("");
//     }
//   };
//   /** ------------------------->  End Mobile Validation    <--------------------------------------  */



//   /**  -------------------------> start TextArea Validation   <------------------------------------- */
//   const [remarksError, setRemarksError] = useState({});
//   const validateTextarea = (id, value) => {
//     if (value.length > 299) {
//       setRemarksError((prev) => ({
//         ...prev,
//         [id]: "Maximum 300 characters allowed.",
//       }));
//     } else {
//       setRemarksError((prev) => ({ ...prev, [id]: "" }));
//     }
//   };
//   /**  -------------------------> End TextArea Validation   <------------------------------------- */

//   /**  -------------------------> start Duration Validation   <------------------------------------- */
//   const [NmberpersonErro, setNumberpersonError] = useState("");
//   const validatenumberperson = (value) => {
//     const number = parseInt(value, 10);

//     if (isNaN(number) || number < 0 || number >= 200) {
//       setNumberpersonError("Enter a number between 0 and 199");
//     } else {
//       setNumberpersonError("");
//     }
//   };

//   /**  -------------------------> End Duration Validation   <------------------------------------- */


// const isFormValid = () => {
//   const requiredFields = formElements
//     .filter((el) => el.require)
//     .map((el) => el.id)
//     .concat(["callType"]);

//   const allFieldsFilled = requiredFields.every(
//     (id) => formData[id] && formData[id].toString().trim() !== ""
//   );

//   const noErrors =
//     nameError === "" &&
//     phoneError === "" &&
//     NmberpersonErro === "" &&
//     Object.values(remarksError).every((err) => err === "");

//   return allFieldsFilled && noErrors;
// };


// const handleDelete = async (item) => {
//   if (!window.confirm("Are you sure you want to delete this record?")) return;

//   try {
//     const response = await fetch(`http://localhost:3000/deletecalllog/${item.id}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) throw new Error("Failed to delete call log");

//     // Refresh the logs
//     fetchLogs();
//     alert("Deleted successfully!");
//   } catch (err) {
//     console.error(err);
//     alert("Failed to delete");
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await fetch("http://localhost:3000/createcalllogs", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//      body: JSON.stringify({
//   name: formData.phoneName,
//   number: formData.phoneNumber,
//   date: formData.phonedate,
//   description: formData.callDescription,
//   nextFollowUpDate: formData.phonedatefollow,
//   duration: formData.phoneDuration,
//   note: formData.callNote,
//   callType: formData.callType,
// }),
//     });

//     if (response.ok) {
//   setFormData({});
//   setNameError("");
//   setPhoneError("");
//   setNumberpersonError("");
//   setRemarksError({});
//   fetchLogs(); // ⬅ Refresh
// }

//     const data = await response.json();
//     // console.log("Call log saved:", data);
//   } catch (error) {
//     console.error("Error saving call log:", error);
//   }
// };

//   return (
//     <div style={{ display: "flex" }}>
//       {/* Left Section - Form */}
//       <div
//         style={{
//           flex: 1,
//           padding: "7px",
//           borderRight: "1px solid #ccc",
//           margin: "0px",
//         }}
//       >
//         <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
//           Add Phone Call Log
//         </h4>
//         <form>
//           {formElements.map((item) => {
//             if (item.type === "textarea") {
//               return (
//                 <div key={item.id} className="call-group-create">
//                   <label htmlFor={item.id}>
//                     {item.label}
//                     {item.require && <span className="required">*</span>}
//                   </label>
//                   <textarea
//                     id={item.id}
//                     name={item.id}
//                     className="call-group-create-textarea"
//                     value={formData[item.id] || ""}
//                     maxLength={300}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       validateTextarea(item.id, val);
//                       setFormData((prev) => ({
//                         ...prev,
//                         [item.id]: val,
//                       }));
//                     }}
//                   />
//                   {remarksError[item.id] && (
//                     <div className="error-message">{remarksError[item.id]}</div>
//                   )}
//                   <div
//                     className="char-count"
//                     style={{
//                       fontSize: "10px",
//                       color:
//                         (formData[item.id]?.length || 0) > 300 ? "red" : "gray",
//                     }}
//                   >
//                     {formData[item.id]?.length || 0}/300
//                   </div>
//                 </div>
//               );
//             }

//             if (item.type === "date") {
//               const today = new Date();
//               const oneYearBack = new Date(today);
//               oneYearBack.setFullYear(today.getFullYear() - 1);

//               const oneYearAhead = new Date(today);
//               oneYearAhead.setFullYear(today.getFullYear() + 1);

//               // 📌 Format date as: 15-Aug-2025
//               const formatDate = (date) => {
//                 const day = String(date.getDate()).padStart(2, "0");
//                 const month = date.toLocaleString("en-US", { month: "short" });
//                 const year = date.getFullYear();
//                 return `${day}-${month}-${year}`;
//               };

//               return (
//                 <div key={item.id} className="call-group-create">
//                   <label htmlFor={item.id}>
//                     {item.label}
//                     {item.require && <span className="required">*</span>}
//                   </label>
//                   <div className="call-group-create-date">
//                     <DatePicker
//                       id={item.id}
//                       selected={
//                         formData[item.id] ? new Date(formData[item.id]) : null
//                       }
//                       onChange={(date) => {
//                         const formatted = formatDate(date);
//                         setFormData((prev) => ({
//                           ...prev,
//                           [item.id]: formatted,
//                         }));
//                       }}
//                       minDate={oneYearBack}
//                       maxDate={oneYearAhead}
//                       placeholderText="Select Date"
//                       dateFormat="dd-MMM-yyyy"
//                     />
//                   </div>
//                 </div>
//               );
//             }

//             if (item.type === "text") {
//               return (
//                 <div key={item.id} className="call-group-create">
//                   <label htmlFor={item.id}>
//                     {item.label}
//                     {item.require && <span className="required">*</span>}
//                   </label>
//                   <input
//                     type="text"
//                     id={item.id}
//                     name={item.id}
//                     className="call-group-create-input"
//                     value={formData[item.id] || ""} // step -1
//                     maxLength={
//                       item.id === "phoneNumber"
//                         ? 10
//                         : item.id === "phoneDuration"
//                         ? 10
//                         : undefined
//                     }
//                    onChange={(e) => {
//   let val = e.target.value;

//   // ✅ Trigger validation if needed
//   if (item.id === "phoneName") {
//     validateName(val);
//   }

//   if (item.id === "phoneNumber") {
//     validatePhone(val);
//   }

//   if (item.id === "phoneDuration") {
//     validatenumberperson(val);
//   }

//   // ✅ Reset pagination when searching
//   if (item.id === "callSearch") {
//     setCurrentPage(1);
//   }

//   // ✅ Always update form data
//   setFormData((prev) => ({
//     ...prev,
//     [item.id]: val,
//   }));
// }}

//                   />

//                   {/* ✅ ADDED: Show name error if any */}
//                   {item.id === "phoneName" && nameError && (
//                     <div className="error-message">{nameError}</div>
//                   )}

//                   {item.id === "phoneNumber" && phoneError && (
//                     <div className="error-message">{phoneError}</div>
//                   )}

//                   {item.id === "phoneDuration" && NmberpersonErro && (
//                     <div className="error-message">{NmberpersonErro}</div>
//                   )}
//                 </div>
//               );
//             }

//             return null;
//           })}
//           {/* <label style={{ fontSize: "14px", marginRight: "15px" }}>
//             Call Type
//           </label>
//           <label style={{ fontSize: "14px", marginRight: "6px" }}>
//             <input type="radio" name="callType" value="Incoming" /> Incoming
//           </label>
//           <label style={{ fontSize: "14px" }}>
//             <input type="radio" name="callType" value="Outgoing" /> Outgoing
//           </label> */}

//           <label style={{ fontSize: "14px", marginRight: "15px" }}>
//   Call Type
// </label>
// <label style={{ fontSize: "14px", marginRight: "6px" }}>
//   <input
//     type="radio"
//     name="callType"
//     value="Incoming"
//     checked={formData.callType === "Incoming"}
//     onChange={(e) =>
//       setFormData((prev) => ({
//         ...prev,
//         callType: e.target.value,
//       }))
//     }
//   />{" "}
//   Incoming
// </label>
// <label style={{ fontSize: "14px" }}>
//   <input
//     type="radio"
//     name="callType"
//     value="Outgoing"
//     checked={formData.callType === "Outgoing"}
//     onChange={(e) =>
//       setFormData((prev) => ({
//         ...prev,
//         callType: e.target.value,
//       }))
//     }
//   />{" "}
//   Outgoing
// </label>


//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginTop: "12px",
//             }}
//           >
//            <button
//   onClick={handleSubmit}
//   style={{
//     fontSize: "14px",
//     width: "44%",
//     height: "25px",
//     padding: "0px",
//     backgroundColor: isFormValid() ? "#007bff" : "#ccc",
//     color: "white",
//     border: "none",
//     cursor: isFormValid() ? "pointer" : "not-allowed",
//   }}
//   disabled={!isFormValid()}
// >
//   Save
// </button>

//           </div>
//         </form>

//       </div>

//       {/* Right Section - Table */}
//       <div
//         style={{
//           flex: 3,
//           padding: "7px",
//           borderRight: "1px solid #ccc",
//           margin: "0px",
//         }}
//       >
//         <h4 style={{ padding: "0px", margin: "0px 0px 13px" }}>
//           Phone Call Log List
//         </h4>
//         {/* <input
//           type="text"
//           placeholder="Search..."
//           style={{ marginBottom: "10px", width: "20%" }}
//         /> */}

//         {formElement.map((item) => {
//           if (item.id === "callSearch") {
//             return (
//               <div key={item.id} className="call-group-create">
//                 <label htmlFor={item.id}>
//                   {item.label}
//                   {item.require && <span className="required">*</span>}
//                 </label>
//                 <input
//                   style={{ width: "20%" }}
//                   type="text"
//                   id={item.id}
//                   name={item.id}
//                   className="call-group-create-input"
//                   value={formData[item.id] || ""}
//                   onChange={(e) => {
//                     let val = e.target.value;

//                     setFormData((prev) => ({
//                       ...prev,
//                       [item.id]: val,
//                     }));
//                   }}
//                 />
//               </div>
//             );
//           }
//           return null;
//           // ...handle textarea and date types below
//         })}
//        <div style={{ maxHeight: "450px", overflowY: "auto" }}>
//         <table border="0" cellPadding="10" cellSpacing="0" width="100%" className="enquiry-table">
//           <thead>
//             <tr>
//               <th>Sl No</th>
//               <th>Name</th>
//               <th>Phone</th>
//               <th>Date</th>
//               <th>Next Follow Up Date</th>
//               <th>Call Type</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody style={{ border: "1px solid red" }}>
//          {currentRecords.map((log, index) => (
//               <tr key={index}>
//                 <td>{num++}</td>
//                 <td>{log.name}</td>
//                 <td>{log.number}</td>
//                 <td>{log.date}</td>
//                 <td>{log.next_follow_up_date || "-"}</td>
//                 <td>
//                   <strong>{log.call_type}</strong>
//                 </td>
//                 <td>
//                    <div className="action-menu">
//     <i className="fas fa-ellipsis-v"></i>
//     <div className="dropdown-content">
//      <div className="view" onClick={() => handleView(log)}>View</div>
// <div className="edit" onClick={() => handleEdit(log)}>Edit</div>
// <div className="delete" onClick={() => handleDelete(log)}>Delete</div>

//     </div>
//   </div>
//                 </td>
//               </tr>
//             ))}
//             {logs.length === 0 && (
//               <tr>
//                 <td colSpan="6" style={{ textAlign: "center" }}>
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//         </div>
         
//    {/* Pagination */}
//         <div className="pagination" style={{ marginTop: "10px" }}>
//           <span>Page: {currentPage} of {totalPages}</span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Prev
//           </button>
//           <button className="active">{currentPage}</button>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhoneCallLog;
