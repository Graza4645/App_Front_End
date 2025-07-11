import React, { useState, useEffect } from "react";
import "./createvisitor.css";

// here i will implement  you code

const formElements = [
  {
    id: "Purpose",
    label: "Purpose",
    type: "dropdown",
    options: [
      "Marketing",
      "Parent Teacher Meeting",
      "Student Meeting",
      "Staff Meeting",
      "Principal Meeting",
    ],
    position: "left",
    require: true,
  },
  {
    id: "MeetingWith",
    label: "Meeting With",
    type: "dropdown",
    options: ["Staff", "Student", "Parent"],
    position: "right",
    require: true,
  },
  {
    id: "Staff",
    label: "Staff",
    type: "dropdown",
    options: [], // dynamic
    position: "left",
    require: true,
  },
  {
    id: "class",
    label: "Class",
    type: "dropdown",
    options: ["10th", "9th", "8th"],
    position: "left",
    require: true,
  },
  {
    id: "section",
    label: "Section",
    type: "dropdown",
    options: ["A", "B", "C"],
    position: "right",
    require: true,
  },
  {
    id: "student",
    label: "Student",
    type: "dropdown",
    options: ["Kallua", "Pandra", "Motka", "Chunnu", "kaliya"],
    position: "right",
    require: true,
  },
  {
    id: "VisitorName",
    label: "Visitor Name",
    type: "text",
    position: "right",
    require: false,
  },
  {
    id: "Phone",
    label: "Phone Number",
    type: "text",
    position: "right",
    require: true,
  },
  {
    id: "idcard",
    label: "ID Card",
    type: "text",
    position: "left",
    require: true,
  },
  {
    id: "Numberperson",
    label: "Number Of Person",
    type: "text",
    position: "right",
    require: true,
  },
  {
    id: "date",
    label: "Date",
    type: "date",
    position: "left",
    require: true,
  },
  {
    id: "inTime",
    label: "In Time",
    type: "time",
    position: "right",
    require: true,
  },
  {
    id: "outTime",
    label: "Out Time",
    type: "time",
    position: "left",
    require: true,
  },
  {
    id: "fileUpload",
    label: "Upload Documents",
    type: "file",
    position: "right",
    require: true,
  },

  {
    id: "comments",
    label: "Write comments",
    type: "text",
    position: "left",
    require: true,
  },
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
      setPhoneError("Mobile number should start with 6 or above");
    } else {
      setPhoneError("");
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
    const payload = {
      purpose: formData.Purpose,
      meeting_with: formData.MeetingWith,
      staff: formData.Staff,
      visitor_name: formData.VisitorName,
      id_card: formData.idcard,
      phone_number: formData.Phone,
      date: formData.date,
      number_of_person: formData.Numberperson,
      in_time: formData.inTime,
      out_time: formData.outTime,
      comments: formData.comments,
      upload_documents: formData.fileUpload || "",
    };

    console.log("Payload:", payload);

    const res = await fetch("http://localhost:3000/visitorstaff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);

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
            onChange={(e) => handleChange(item.id, e.target.value)}
          />
        </div>
      );
    }

    if (item.type === "date" || item.type === "time") {
      const value = formData[item.id] || "";
      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <input
            type={item.type}
            id={item.id}
            name={item.id}
            className="text-input"
            value={value}
            onChange={(e) => handleChange(item.id, e.target.value)}
          />
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
