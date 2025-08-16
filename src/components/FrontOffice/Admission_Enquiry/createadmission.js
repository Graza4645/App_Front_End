import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { useNavigate } from "react-router-dom";
import "./createadmission.css";
import { API_BASE_URL } from "../../../config.js";

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
      label: "Date",    // label: "Last Follow Up Date",
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

  /**  -------------------------> start Email Validation   <------------------------------------- */
  const [emailError, setEmailError] = useState("");
  const validateEmail = (value) => {
    if (!value.includes("@")) {
      setEmailError("Email should contain '@'"); // ✅ ADDED
    } else {
      setEmailError("");
    }
  };

  /**  -------------------------> End Email Validation   <------------------------------------- */

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

  /**  -------------------------> start Number of person Validation   <------------------------------------- */
  const [childError, setChildError] = useState("");
  const validateNumberOfChild = (value) => {
    const num = parseInt(value, 10);
    if (!/^\d+$/.test(value)) {
      setChildError("Only numeric values are allowed.");
    } else if (num < 1 || num > 5) {
      setChildError("Number of children should be between 1 and 5.");
    } else {
      setChildError("");
    }
  };

  /**  -------------------------> End Number of prson Validation   <------------------------------------- */

  const [formData, setFormData] = useState({
    admissionname: "",
    admissionphone: "",
    admissionEmail: "",
    Addressadmission: "",
    Descriptionadmission: "",
    Noteadmission: "",
    admissiondate: "",
    admissiondatefollowUp: "",
    assigned: "",
    reference: "",
    source: "",
    classadmissioncreate: "",
    numberofchild: "",
  });

  const isFormValid = () => {
    return (
      formData.admissionname.trim() !== "" &&
      formData.admissionphone.trim().length === 10 &&
      /^[6-9]/.test(formData.admissionphone) &&
      formData.admissionEmail.includes("@") &&
      formData.Addressadmission.trim() !== "" &&
      formData.Descriptionadmission.trim() !== "" &&
      formData.Noteadmission.trim() !== "" &&
      formData.admissiondate !== "" &&
      formData.admissiondatefollowUp !== "" &&
      formData.assigned !== "" &&
      formData.reference !== "" &&
      formData.source !== "" &&
      formData.classadmissioncreate !== "" &&
      /^\d+$/.test(formData.numberofchild) &&
      parseInt(formData.numberofchild, 10) >= 1 &&
      parseInt(formData.numberofchild, 10) <= 5 &&
      !phoneError &&
      !nameError &&
      !emailError &&
      !childError &&
      Object.values(remarksError).every((err) => err === "")
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.admissionname,
      phone: formData.admissionphone,
      email: formData.admissionEmail,
      address: formData.Addressadmission,
      description: formData.Descriptionadmission,
      note: formData.Noteadmission,
      date: formData.admissiondate,
      next_follow_up_date: formData.admissiondatefollowUp,
      assigned: formData.assigned,
      reference: formData.reference,
      source: formData.source,
      class: formData.classadmissioncreate,
      number_of_child: parseInt(formData.numberofchild, 10),
    };

    try {
      console.log('from create---',API_BASE_URL)
      const response = await fetch( `${API_BASE_URL}/admissioncraete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Enquiry submitted successfully!");
        console.log("API Response:", data);
        // Reset form if needed
        setFormData({
          admissionname: "",
          admissionphone: "",
          admissionEmail: "",
          Addressadmission: "",
          Descriptionadmission: "",
          Noteadmission: "",
          admissiondate: "",
          admissiondatefollowUp: "",
          assigned: "",
          reference: "",
          source: "",
          classadmissioncreate: "",
          numberofchild: "",
        });
      } else {
        console.error("Submission failed:", data.error);
        alert("Failed to submit enquiry. Try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Server error occurred. Check console.");
    }
  };

  return (
    <div className="admission-enquiry-container">
      <h4 style={{marginLeft : "13px"}}>Admission Enquiry</h4>
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
                  value={formData[item.id] || ""} // step -1
                  maxLength={item.id === "admissionphone" ? 10 : undefined} // step -2
                  onChange={(e) => {
                    let val = e.target.value;

                    if (item.id === "admissionphone") {
                      val = val.replace(/\D/g, "");
                      validatePhone(val);
                    }

                    if (item.id === "admissionname") {
                      validateName(val);
                    }

                    if (item.id === "admissionEmail") {
                      validateEmail(val);
                    }

                    if (item.id === "numberofchild") {
                      validateNumberOfChild(val);
                    }

                    setFormData((prev) => ({
                      ...prev,
                      [item.id]: val,
                    }));
                  }}
                />

                {/* ✅ ADDED: Show phone error if any */}
                {item.id === "admissionphone" && phoneError && (
                  <div className="error-message">{phoneError}</div>
                )}

                {/* ✅ ADDED: Show name error if any */}
                {item.id === "admissionname" && nameError && (
                  <div className="error-message">{nameError}</div>
                )}

                {item.id === "admissionEmail" && emailError && (
                  <div className="error-message">{emailError}</div>
                )}

                {item.id === "numberofchild" && childError && (
                  <div className="error-message">{childError}</div>
                )}
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
                  style={{ fontSize : "10px",
                    color: formData[item.id].length > 300 ? "red" : "gray",
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

          if (item.type === "dropdown") {
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
                  className="dropdown-admission-create"
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
        <button id="savecreateadmission"
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={!isFormValid() ? "disabled-button" : ""}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AdmissionEnquiryForm;
