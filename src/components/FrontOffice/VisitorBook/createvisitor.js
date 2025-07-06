import React from 'react';
import './createvisitor.css';

const formElements = [
  {
    id: 'department',
    label: 'Purpose',
    type: 'dropdown',
    options: ['HR', 'Finance', 'Engineering', 'Marketing'],
    position: 'left',
    required: true,
  },
  {
    id: 'phone',
    label: 'Phone',
    type: 'text',
    position: 'left',
    required: false,
  },
  {
    id: 'idCard',
    label: 'ID Card',
    type: 'text',
    position: 'left',
    required: true,
  },
  {
    id: 'meetingWith',
    label: 'Meeting With',
    type: 'dropdown',
    options: ['Student', 'Staff', 'Parent'],
    position: 'right',
    required: true,
  },
  {
    id: 'visitorName',
    label: 'Visitor Name',
    type: 'text',
    position: 'right',
    required: false,
  },
 
  {
    id: 'DateTime',
    label: 'Date Time',
    type: 'date',
    position: 'right',
    required: true,
  },
   {
    id: 'inTime',
    label: 'Out Time',
    type: 'time',
    position: 'right',
    required: true,
  },
   {
    id: 'inTime',
    label: 'In Time',
    type: 'time',
    position: 'left',
    required: true,
  },
];

export default function CreateVisitorBook() {
  const leftItems = formElements.filter((item) => item.position === 'left');
  const rightItems = formElements.filter((item) => item.position === 'right');

  const renderItem = (item) => {
    return (
      <div key={item.id} className="form-group">
        <label htmlFor={item.id}>
          {item.label}
          {item.required && <span className="mandatory">*</span>}
        </label>

        {item.type === 'dropdown' ? (
          <select
            id={item.id}
            name={item.id}
            className="dropdown"
            required={item.required}
          >
            <option value="">--Select--</option>
            {item.options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : item.type === 'time' ? (
          <input
            type="time"
            id={item.id}
            name={item.id}
            className="time-input"
            required={item.required}
          />
        ) : item.type === 'date' ?(
          <input 
           type='date'
           id={item.id}
           name={item.name}
           className='date-input'
           required={item.required}
          
          />
        ):
        
        (
          <input
            type="text"
            id={item.id}
            name={item.id}
            className="text-input"
            required={item.required}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="header">Front Office → Visitor Book → Create New Visitor</div>
      <div className="container">
        <div className="left">{leftItems.map(renderItem)}</div>
        <div className="right">{rightItems.map(renderItem)}</div>
      </div>
    </>
  );
}
