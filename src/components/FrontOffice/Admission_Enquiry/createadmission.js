import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "./createadmission.css";

const AdmissionEnquiryForm = () => {
  const formElements = [
    {
      id: "admissionname",
      label: "Name",
      type: "text",
      position: "right",
      require: true,
    },
    {
      id: "admissionphone",
      label: "Phone",
      type: "text",
      position: "right",
      require: true,
    },

    ,
    {
      id: "admissionEmail",
      label: "Email",
      type: "text",
      position: "right",
      require: true,
    },

    {
      id: "Addressadmission",
      label: "Address",
      type: "textarea",
      position: "left",
      require: true,
    },

    {
      id: "Descriptionadmission",
      label: "Description",
      type: "textarea",
      position: "left",
      require: true,
    },

    {
      id: "Noteadmission",
      label: "Note",
      type: "textarea",
      position: "left",
      require: true,
    },

    {
      id: "admissiondate",
      label: "Date",
      type: "date",
      position: "left",
      require: true,
    },
    {
      id: "admissiondatefollowUp",
      label: "Next Follow Up Date",
      type: "date",
      position: "left",
      require: true,
    },

    {
      id: "assigned",
      label: "Assigned",
      type: "dropdown",
      options: ["Nursery", "LKG"],
      require: true,
    },
    {
      id: "reference",
      label: "Reference",
      type: "dropdown",
      options: ["Nursery", "LKG"],
      require: true,
    },
    {
      id: "source",
      label: "Source",
      type: "dropdown",
      options: ["Nursery", "LKG"],
      require: true,
    },
    {
      id: "classadmissioncreate",
      label: "Class",
      type: "dropdown",
      options: ["Nursery", "LKG"],
      require: true,
    },
    {
      id: "numberofchild",
      label: "Number Of Child",
      type: "text",
      position: "right",
      require: true,
    },
  ];

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
        {formElements.map((item) => {
          if (item.type === "text") {
            return (
              <div key={item.id} className="addmisson-group-create">
                <label htmlFor={item.id}>
                  {item.label}
                  {item.require && <span className="required">*</span>}
                </label>
                <input
                  type="text"
                  id={item.id}
                  name={item.id}
                  className="addmisson-group-create-input"
                  value={formData[item.id]}
                  maxLength={item.id === "phone" ? 10 : undefined}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (item.id === "phone") {
                      val = val.replace(/\D/g, "");
                    }
                    setFormData((prev) => ({
                      ...prev,
                      [item.id]: val,
                    }));
                  }}
                />
              </div>
            );
          }

          if (item.type === "textarea") {
            return (
              <div key={item.id} className="addmisson-group-create">
                <label htmlFor={item.id}>
                  {item.label}
                  {item.require && <span className="required">*</span>}
                </label>
                <textarea
                  id={item.id}
                  name={item.id}
                  className="addmisson-group-create-textarea"
                  value={formData[item.id] || ""}
                  onChange={handleChange}
                />
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
              <div key={item.id} className="addmisson-group-create">
                <label htmlFor={item.id}>
                  {item.label}
                  {item.require && <span className="required">*</span>}
                </label>
                <div className="addmisson-group-create-date">
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

          if ((item.type = "dropdown")) {
            return (
              <div key={item.id} className="addmisson-group-create">
                <label htmlFor={item.id}>
                  {item.label}
                  {item.require && <span className="required">*</span>}
                </label>
                <select
                  id={item.id}
                  name={item.id}
                  // value={value}
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
          return null;
        })}
      </form>

      <div className="form-actions">
        <button type="submit" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AdmissionEnquiryForm;
