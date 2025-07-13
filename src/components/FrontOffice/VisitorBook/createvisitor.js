import React, { useState, useEffect } from "react";
import "./createvisitor.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


// here i will implement  you code

const formElements = [
  { id: "Purpose", label: "Purpose", type: "dropdown", options: ["Marketing", "Parent Teacher Meeting", "Student Meeting", "Staff Meeting", "Principal Meeting"], position: "left", require: true },
  { id: "MeetingWith", label: "Meeting With", type: "dropdown", options: ["Staff", "Student", "Parent"], position: "right", require: true },
  { id: "Staff", label: "Staff", type: "dropdown", options: [], position: "left", require: true },
  { id: "class", label: "Class", type: "dropdown", options: ["10th", "9th", "8th"], position: "left", require: true },
  { id: "section", label: "Section", type: "dropdown", options: ["A", "B", "C"], position: "right", require: true },
  { id: "student", label: "Student", type: "dropdown", options: ["Kallua", "Pandra", "Motka", "Chunnu", "kaliya"], position: "right", require: true },
  { id: "VisitorName", label: "Visitor Name", type: "text", position: "right", require: true },
  { id: "Phone", label: "Phone Number", type: "text", position: "right", require: true },
  { id: "idcard", label: "ID Card", type: "text", position: "left", require: true },
  { id: "Numberperson", label: "Number Of Person", type: "text", position: "right", require: true },
  { id: "date", label: "Date", type: "date", position: "left", require: true },
  { id: "inTime", label: "In Time", type: "time", position: "left", require: true },
  { id: "outTime", label: "Out Time", type: "time", position: "right", require: true },
  { id: "fileUpload", label: "Upload Documents", type: "file", position: "right", require: true },
  { id: "comments", label: "Write comments", type: "text", position: "left", require: true },
];

export default function CreateVisitorBook() {
  const leftItems = formElements.filter((item) => item.position === "left");
  const rightItems = formElements.filter((item) => item.position === "right");

  const [meetingWith, setMeetingWith] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formData, setFormData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [staffOptions, setStaffOptions] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(null);

  const [visitorNameError, setVisitornameError] = useState("");
  const [NmberpersonErro, setNumberpersonError] = useState("");

  const [inTimeError, setInTimeError] = useState("");
const [outTimeError, setOutTimeError] = useState("");


  useEffect(() => {
    if (meetingWith === "Staff") {
      const fetchStaff = async () => {
        try {
          const res = await fetch("http://localhost:3000/getStaffDetails");
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

    setIsFormValid(allFilled && !phoneError);
  }, [formData, meetingWith, phoneError]);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      const commonPayload = { purpose: formData.Purpose, meeting_with: formData.MeetingWith, id_card: formData.idcard, date: formData.date, visitor_name: formData.VisitorName, out_time: formData.outTime, phone_number: formData.Phone, comments: formData.comments, number_of_person: formData.Numberperson, in_time: formData.inTime, upload_documents: formData.fileUpload || "" };

      let payload = {};
      let apiUrl = "";

      if (formData.MeetingWith === "Staff") {
        payload = {
          ...commonPayload,
          staff: formData.Staff,
        };
        apiUrl = "http://localhost:3000/visitorstaff";
      } else if (formData.MeetingWith === "Student") {
        payload = {
          ...commonPayload,
          class: formData.class,
          section: formData.section,
          student: formData.student,
        };
        apiUrl = "http://localhost:3000/visitorstudent";
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

      const data = await res.json();
      // console.log(data);

      if (res.ok) {
        alert("Visitor added successfully!");
        setFormData({});
        setMeetingWith("");
        setPhone("");
      } else {
        alert("Error: " + (data.error || "Failed to add visitor"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Submission failed.");
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
              if (item.id === "MeetingWith") setMeetingWith(val);

              if (item.id === "Staff") {
                const selected = staffOptions.find((s) => s.staff_name === val);
                if (selected && selected.mobile_number) {
                  setPhone(selected.mobile_number);
                  validatePhone(selected.mobile_number);
                  handleChange("Phone", selected.mobile_number);
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

  return (
    <div key={item.id} className="form-group">
      <label htmlFor={item.id}>
        {item.label}
        {item.require && <span className="required">*</span>}
      </label>
      <DatePicker
        id={item.id}
        selected={formData[item.id] ? new Date(formData[item.id]) : null}
        onChange={(date) => handleChange(item.id, date)}
        minDate={oneYearBack}
        maxDate={oneYearAhead}
        placeholderText="Pick a date"
        dateFormat="dd-MMM-YYYY"
        className="text-input"
      />
    </div>
  );
}


if (item.type === "time") {
  const value = formData[item.id] || "";

  // Generate dropdown options from 09:00 to 18:00 in 30-min steps
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 9; h <= 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        const value24 = `${hour}:${minute}`;
        const h12 = ((h % 12) || 12).toString();
        const ampm = h < 12 ? "AM" : "PM";
        const label = `${h12}:${minute} ${ampm}`;
        options.push({ value: value24, label });
      }
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
            {t.label}
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
      <div className="container">
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
    </>
  );
}
