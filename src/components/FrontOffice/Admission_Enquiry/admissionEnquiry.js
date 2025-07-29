import React, { useState } from "react";
import "./AdmissionEnquiry.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const AdmissionEnquiry = () => {
    const navigate = useNavigate();
 const [formData, setFormData] = useState({
  Std: "",
  Source: "",
  EnquiryFromDate: null, //new Date(),
  EnquiryToDate: null,//new Date(),
  status: "",
});

/**  Starting */
   const formElements = 
   [
  
  { id : 'Std', label : 'Class',type: "dropdown", options: ["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11 - Science", "Class 11 - Commerce", "Class 11 - Arts", "Class 12 - Science", "Class 12 - Commerce", "Class 12 - Arts", "B.A.", "B.Sc.", "B.Com.", "B.Tech", "BBA", "BCA", "M.A.", "M.Sc.", "M.Com.", "M.Tech", "MBA", "MCA"], require: true,},
  {id: "Source",label: "Source",type: "dropdown",require: true,options: ["Advertisement", "Online Front Site", "Google Ads", "Admission Campaign", "Front Office", "parents", "Student"]},
  { id: "EnquiryFromDate", label: "Enquiry From Date", type: "date", position: "left", require: true },
  { id: "EnquiryToDate", label: "Enquiry To Date", type: "date", position: "left", require: true },
  { id: "status", label: "Status", type: "dropdown", options: ["All", "Active", "Passive", "Dead", "Won", "Lost"],position: "left", require: true },

]


  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
   const totalPages = Math.ceil(12 / 12);

  const handleChange = (name, value) => {
  setFormData(prev => ({ ...prev, [name]: value }));
};

 

  const handleSearch = () => {
    console.log("Search triggered with:", formData);
    // Add fetch logic for admission enquiries based on criteria
  };

  return (
    <>
    <div className="admission-enquiry-wrapper">
      <div className="filter-section">

       <h4 className="admissioncriteria" style={{ margin: "4px 0" }}>Select Criteria</h4>

        <div className="form-row">
         

{formElements.map((item) => {
  const value = formData[item.id] || "";

  if (item.id === "Std" || item.id === "Source" || item.id === "status") {
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
          onChange={handleChange}
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
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div key={item.id} className="addmisson-group">
      <label htmlFor={item.id}>
        {item.label}
        {item.require && <span className="required">*</span>}
      </label>
      <div className="datepicker-wrapper-admission">
        <DatePicker
          id={item.id}
          selected={formData[item.id] ? new Date(formData[item.id]) : null}
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
          <div className="addmisson-group">
            <button onClick={handleSearch} className="search-btn">Search</button>
          </div>
        </div>
      </div>

      <div className="table-section">


    <div className="table-header">
  <h4 className="admissioncriteria" style={{ margin: "4px 0" }}>Admission Enquiry</h4>

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
      create +
    </button>
  </div>
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
            <tr>
              <td colSpan="8" className="no-data">
                <div className="no-data-img" />
                <div>No data available in table</div>
                <p>↩ Add new record or search with different criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
      </>

  );
};

export default AdmissionEnquiry;