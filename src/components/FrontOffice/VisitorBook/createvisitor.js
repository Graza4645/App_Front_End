import React, { useState, useEffect } from "react";
import "./createvisitor.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

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

const formElements = [
  {id:"Purpose",label:"Purpose",type:"dropdown",options:["Marketing","Parent Teacher Meeting","Student Meeting","Staff Meeting","Principal Meeting"],position:"left",require:true},
  {id:"MeetingWith",label:"Meeting With",type:"dropdown",options:["Staff","Student","Parent"],position:"right",require:true},
  {id:"Staff",label:"Staff",type:"dropdown",options:[],position:"left",require:true},
  {id:"class",label:"Class",type:"dropdown",options:["Class 10","Class 9","Class 8"],position:"left",require:true},
  {id:"section",label:"Section",type:"dropdown",options:["A","B","C"],position:"right",require:true},
  {id:"student",label:"Student",type:"dropdown",options:["Kallua","Pandra","Motka","Chunnu","kaliya"],position:"right",require:true},
  {id:"VisitorName",label:"Visitor Name",type:"text",position:"right",require:true},
  {id:"Phone",label:"Phone Number",type:"text",position:"right",require:true},
  {id:"idcard",label:"ID Card",type:"text",position:"left",require:true},
  {id:"Numberperson",label:"Number Of Person",type:"text",position:"right",require:true},
  {id:"createdate",label:"Date",type:"date",position:"left",require:true},
  {id:"inTime",label:"In Time",type:"time",position:"left",require:true},
  {id:"outTime",label:"Out Time",type:"time",position:"right",require:true},
  {id:"fileUpload",label:"Upload Documents",type:"file",position:"right",require:true},
  {id:"comments",label:"Write comments",type:"text",position:"left",require:true}
];

export default function CreateVisitorBook() {
  const navigate = useNavigate();
  const leftItems = formElements.filter((item) => item.position === "left");
  const rightItems = formElements.filter((item) => item.position === "right");

  const [meetingWith, setMeetingWith] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formData, setFormData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [staffOptions, setStaffOptions] = useState([]);
  const [visitorNameError, setVisitornameError] = useState("");
  const [NmberpersonErro, setNumberpersonError] = useState("");

  const [inTimeError, setInTimeError] = useState("");
  const [outTimeError, setOutTimeError] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const showCustomAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  useEffect(() => {
    if (meetingWith === "Staff") {
      const fetchStaff = async () => {
        try {
          const apiUrl = API_BASE_URL || 'http://localhost:8000/api/v1';
          console.log('API_BASE_URL:', apiUrl);
          console.log('Fetching stafflist from:', `${apiUrl}/stafflist`);
          const res = await fetch(`${apiUrl}/stafflist`);
          const json = await res.json();
          const staffList = Array.isArray(json) ? json : json.data;
          if (!Array.isArray(staffList)) {
            console.error("Invalid staff data:", json);
            return;
          }
          setStaffOptions(staffList); // keep full objects
        } catch (err) {
          console.error("Error fetching staff list", err);
        }
      };
      fetchStaff();
    }
  }, [meetingWith]);

  const validatePhone = (value) => {
    if (value.length !== 10) {
      setPhoneError("Mobile number should be exactly 10 digits");
    } else if (parseInt(value[0], 10) < 6) {
      setPhoneError("Indian mobile number should start with 6 and above");
    } else {
      setPhoneError("");
    }
  };

  const validatevisitorname = (value) => {
    const alphabetRegex = /^[A-Za-z\s]+$/;
    if (!alphabetRegex.test(value)) {
      setVisitornameError("allows letters and spaces");
    } else {
      setVisitornameError("");
    }
  };

  const validatenumberperson = (value) => {
    const number = parseInt(value, 10);
    if (isNaN(number) || number < 0 || number >= 200) {
      setNumberpersonError("Enter a number between 0 and 199");
    } else {
      setNumberpersonError("");
    }
  };

  useEffect(() => {
    const requiredFields = formElements.filter((f) => f.require);
    const visibleRequiredFields = requiredFields.filter((field) => {
      if (["class", "section", "student"].includes(field.id)) {
        return meetingWith === "Student";
      }
      if (field.id === "Staff") {
        return meetingWith === "Staff";
      }
      return true;
    });

    const allFilled = visibleRequiredFields.every((f) => {
      const value = formData[f.id];
      return value && value.toString().trim() !== "";
    });

    setIsFormValid(allFilled && !phoneError && !visitorNameError && !NmberpersonErro && !inTimeError && !outTimeError);
  }, [formData, meetingWith, phoneError, visitorNameError, NmberpersonErro, inTimeError, outTimeError]);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields before submission
      if (!formData.MeetingWith) {
        alert("Please select Meeting With type");
        return;
      }

      const commonPayload = {
        purpose: formData.Purpose || "",
        meeting_with: formData.MeetingWith,
        id_card: formData.idcard || "",
        date: formData.createdate || "",
        visitor_name: formData.VisitorName || "",
        out_time: formData.outTime || "",
        phone_number: formData.Phone || "",
        comments: formData.comments || "",
        number_of_person: parseInt(formData.Numberperson) || 1,
        in_time: formData.inTime || "",
        upload_documents: formData.fileUpload || "",
      };

      let payload = {};
      let apiUrl = "";

      if (formData.MeetingWith === "Staff") {
        if (!formData.Staff) {
          alert("Please select a staff member");
          return;
        }
        payload = {
          ...commonPayload,
          staff: formData.Staff,
          staff_id: formData.StaffId,
        };
        apiUrl = `${API_BASE_URL || 'http://localhost:8000/api/v1'}/visitorstaff`;
      } else if (formData.MeetingWith === "Student") {
        if (!formData.class || !formData.section || !formData.student) {
          alert("Please select class, section, and student");
          return;
        }
        payload = {
          ...commonPayload,
          class: formData.class,
          section: formData.section,
          student: formData.student,
        };
        apiUrl = `${API_BASE_URL || 'http://localhost:8000/api/v1'}/visitorStudent`;
      } else {
        alert("Unsupported Meeting With type.");
        return;
      }

      console.log("Submitting to:", apiUrl);
      console.log("Payload:", payload);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        showCustomAlert("Visitor added successfully!");
        setTimeout(() => {
          setFormData({});
          setMeetingWith("");
          setPhone("");
          navigate("/visitorbook");
        }, 2000);
      } else {
        console.error("Server error:", data);
        showCustomAlert("Error: " + (data.message || data.error || "Failed to add visitor"), 'error');
      }
    } catch (err) {
      console.error("Submission error:", err);
      showCustomAlert("Submission failed: " + err.message, 'error');
    }
  };

  const renderItem = (item) => {
    if (
      ["class", "section", "student"].includes(item.id) &&
      meetingWith !== "Student"
    ) {
      return null;
    }

    if (item.id === "Staff" && meetingWith !== "Staff") {
      return null;
    }

    if (item.type === "dropdown") {
      const value = formData[item.id] || "";
      let optionsToRender = item.options || [];

      if (item.id === "Staff") {
        optionsToRender = staffOptions;
      }

      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <select
            id={item.id}
            name={item.id}
            className="dropdown"
            value={item.id === "MeetingWith" ? meetingWith : value}
            onChange={(e) => {
              const val = e.target.value;
              if (item.id === "MeetingWith") {
                setMeetingWith(val);
                // Clear related fields when changing meeting type
                if (val === "Student") {
                  handleChange("Staff", "");
                } else if (val === "Staff") {
                  handleChange("class", "");
                  handleChange("section", "");
                  handleChange("student", "");
                }
              }

              if (item.id === "Staff") {
                const selected = staffOptions.find((s) => s.staff_name === val);
                if (selected) {
                  if (selected.mobile_number) {
                    setPhone(selected.mobile_number);
                    validatePhone(selected.mobile_number);
                    handleChange("Phone", selected.mobile_number);
                  }
                  // Auto-populate ID Card with user_id
                  handleChange("idcard", selected.user_id);
                }
              }

              handleChange(item.id, val);
            }}
          >
            <option value="">--Select--</option>
            {optionsToRender.map((opt, index) => {
              const value = item.id === "Staff" ? opt.staff_name : opt;
              return (
                <option key={index} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      );
    }

    if (item.id === "comments") {
      const value = formData[item.id] || "";
      return (
        <div key={item.id} className="comments-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <br />
          <textarea
            id={item.id}
            name={item.id}
            className="comments"
            value={value}
            onChange={(e) => handleChange(item.id, e.target.value)}
          />
        </div>
      );
    }

    if (item.type === "text") {
      const value = formData[item.id] || "";
      if (item.id === "Phone") {
        return (
          <div key={item.id} className="form-group">
            <label htmlFor={item.id}>
              {item.label}
              {item.require && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id={item.id}
              name={item.id}
              className="text-input"
              value={phone}
              maxLength={10}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setPhone(val);
                validatePhone(val);
                handleChange(item.id, val);
              }}
            />
            {phoneError && <p className="error">{phoneError}</p>}
          </div>
        );
      }

      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <input
            type="text"
            id={item.id}
            name={item.id}
            className="text-input"
            value={value}
            onChange={(e) => {
              handleChange(item.id, e.target.value);
              if (item.id === "VisitorName") {
                validatevisitorname(e.target.value);
              }
              if (item.id === "Numberperson") {
                validatenumberperson(e.target.value);
              }
            }}
          />
          {item.id === "VisitorName" && visitorNameError && (
            <p className="error">{visitorNameError}</p>
          )}

          {item.id === "Numberperson" && NmberpersonErro && (
            <p className="error">{NmberpersonErro}</p>
          )}
        </div>
      );
    }

    if (item.type === "date") {
  const today = new Date();
  const oneYearBack = new Date(today);
  oneYearBack.setFullYear(today.getFullYear() - 1);

  const oneYearAhead = new Date(today);
  oneYearAhead.setFullYear(today.getFullYear() + 1);

  // Format date as: DD-MMM-YYYY
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div key={item.id} className="form-group">
      <label htmlFor={item.id}>
        {item.label}
        {item.require && <span className="required">*</span>}
      </label>
      <div className="datepicker-wrapper-create">
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


    if (item.type === "time") {
      const value = formData[item.id] || "";

      const generateTimeOptions = () => {
  const options = [];
  const start = new Date();
  start.setHours(7, 0, 0, 0); // 07:00
  const end = new Date();
  end.setHours(17, 0, 0, 0); // 17:00

  while (start <= end) {
    const hour = start.getHours().toString().padStart(2, "0");
    const minute = start.getMinutes().toString().padStart(2, "0");
    const value24 = `${hour}:${minute}`;

    options.push({ value: value24, label: value24 });

    start.setMinutes(start.getMinutes() + 1); // step 1 minute
  }

  return options;
};


      const timeOptions = generateTimeOptions();

      const handleTimeChange = (id, selectedValue) => {
        const inTime = formData["inTime"];
        const outTime = formData["outTime"];

        // Clear previous errors
        setInTimeError("");
        setOutTimeError("");

        if (id === "inTime" && outTime) {
          const inT = new Date(`2000-01-01T${selectedValue}`);
          const outT = new Date(`2000-01-01T${outTime}`);
          if (inT >= outT) {
            setInTimeError("In Time must be earlier than Out Time.");
            return;
          }
        }

        if (id === "outTime" && inTime) {
          const inT = new Date(`2000-01-01T${inTime}`);
          const outT = new Date(`2000-01-01T${selectedValue}`);
          if (outT <= inT) {
            setOutTimeError("Out Time must be later than In Time.");
            return;
          }
        }

        handleChange(id, selectedValue);
      };

      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <select
            id={item.id}
            name={item.id}
            className="dropdown"
            value={value}
            onChange={(e) => handleTimeChange(item.id, e.target.value)}
          >
            <option value="">-- Select Time --</option>
            {timeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.value}
              </option>
            ))}
          </select>

          {/* ✅ Show error messages below each field if applicable */}
          {item.id === "inTime" && inTimeError && (
            <p className="error">{inTimeError}</p>
          )}
          {item.id === "outTime" && outTimeError && (
            <p className="error">{outTimeError}</p>
          )}
        </div>
      );
    }

    if (item.type === "file") {
      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <input
            type="file"
            id={item.id}
            name={item.id}
            className="file"
            onChange={(e) => {
              const file = e.target.files[0];
              handleChange(item.id, file?.name || "");
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="header">
        Front Office → Visitor Book → Create New Visitor
      </div>
      <div className="containercreatevisitor">
        <div className="left">
          <span className="headline">Create New VisitorBook</span>
          <br />
          <br />
          {leftItems.map(renderItem)}
        </div>
        <div className="right">
          <span className="headlines">Create New VisitorBook</span>
          <br />
          <br />
          {rightItems.map(renderItem)}
          <div>
            <button
              className="submit"
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {showAlert && (
        <CustomAlert 
          message={alertMessage} 
          type={alertType}
          onClose={() => {
            setShowAlert(false);
            if (alertType === 'success') {
              navigate("/visitorbook");
            }
          }} 
        />
      )}
    </>
  );
}
