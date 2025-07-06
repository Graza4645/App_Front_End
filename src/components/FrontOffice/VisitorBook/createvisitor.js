import React from 'react';
import './createvisitor.css';

const formElements = [
  {
    id: 'department',
    label: 'Department',
    type: 'dropdown',
    options: ['HR', 'Finance', 'Engineering', 'Marketing'],
    position: 'left',
  },
  {
    id: 'cameraAccess',
    label: 'Camera Access',
    type: 'checkbox',
    position: 'left',
  },
  {
    id: 'visitorType',
    label: 'Visitor Type',
    type: 'dropdown',
    options: ['Client', 'Vendor', 'Interviewee'],
    position: 'left',
  },
  {
    id: 'purpose',
    label: 'Visit Purpose',
    type: 'dropdown',
    options: ['Meeting', 'Delivery', 'Interview'],
    position: 'right',
  },
  {
    id: 'wifiAccess',
    label: 'WiFi Access',
    type: 'checkbox',
    position: 'right',
  },
  {
    id: 'building',
    label: 'Building',
    type: 'dropdown',
    options: ['Block A', 'Block B', 'Block C'],
    position: 'right',
  },
];

export default function CreateVisitorBook() {
  const leftItems = formElements.filter((item) => item.position === 'left');
  const rightItems = formElements.filter((item) => item.position === 'right');

const renderItem = (item) => (
  item.type === 'dropdown' ? (
    <div key={item.id} className="form-group">
      <label htmlFor={item.id}>{item.label}</label>
      <select id={item.id} name={item.id} className="dropdown">
        <option value="">--Select--</option>
        {item.options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  ) : item.type === 'checkbox' ? (
    <div key={item.id} className="form-group">
      <label htmlFor={item.id}>{item.label}</label>
      <div className="checkbox-wrapper">
        <input type="checkbox" id={item.id} name={item.id} />
        <span>{item.label}</span>
      </div>
    </div>
  ) : null
);

  return (
    <div className="container">
      <div className="left">
        <h3>Left Side</h3>
        {leftItems.map(renderItem)}
      </div>

      <div className="right">
        <h3>Right Side</h3>
        {rightItems.map(renderItem)}
      </div>
    </div>
  );
}
