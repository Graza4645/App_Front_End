import React, { useState } from "react";
import "./AdmissionEnquiry.css";

const AdmissionEnquiry = () => {
  const [formData, setFormData] = useState({
    className: "",
    source: "",
    fromDate: "",
    toDate: "",
    status: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Search Data: ", formData);
    // API Call or filter logic here
  };

  return (
    <div className="enquiry-wrapper">
      <h2 className="title">Admission Enquiry</h2>

      <div className="filter-container">
        <div className="filter-item">
          <label>Class</label>
          <select name="className" value={formData.className} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Nursery">Nursery</option>
            <option value="KG">KG</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Source</label>
          <select name="source" value={formData.source} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Website">Website</option>
            <option value="Reference">Reference</option>
            <option value="Advertisement">Advertisement</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Enquiry From Date</label>
          <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} />
        </div>

        <div className="filter-item">
          <label>Enquiry To Date</label>
          <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} />
        </div>

        <div className="filter-item">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Open">Open</option>
            <option value="Converted">Converted</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-item search-button">
          <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        </div>
      </div>

      {/* Table or result section here */}
    </div>
  );
};

export default AdmissionEnquiry;
