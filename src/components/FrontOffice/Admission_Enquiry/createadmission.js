import React, { useState } from "react";
import "./createadmission.css";


const AdmissionEnquiryForm = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    note: "",
    date: "",
    followUpDate: "",
    assigned: "",
    reference: "",
    source: "",
    class: "Class 2",
    numberOfChild: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Here you can send data to API
  };

  return (
    <div className="admission-enquiry-container">
      <h2>Admission Enquiry</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name <span className="required">*</span></label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone <span className="required">*</span></label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Note</label>
          <input name="note" value={formData.note} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date <span className="required">*</span></label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Next Follow Up Date <span className="required">*</span></label>
          <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Assigned</label>
          <select name="assigned" value={formData.assigned} onChange={handleChange}>
            <option value="">Select</option>
          </select>
        </div>

        <div className="form-group">
          <label>Reference</label>
          <select name="reference" value={formData.reference} onChange={handleChange}>
            <option value="">Select</option>
          </select>
        </div>
        <div className="form-group">
          <label>Source <span className="required">*</span></label>
          <select name="source" value={formData.source} onChange={handleChange}>
            <option value="">Select</option>
          </select>
        </div>
        <div className="form-group">
          <label>Class</label>
          <select name="class" value={formData.class} onChange={handleChange}>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 3">Class 3</option>
          </select>
        </div>

        <div className="form-group">
          <label>Number Of Child</label>
          <input type="number" name="numberOfChild" value={formData.numberOfChild} onChange={handleChange} />
        </div>
      </form>

      <div className="form-actions">
        <button type="submit" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default AdmissionEnquiryForm;
