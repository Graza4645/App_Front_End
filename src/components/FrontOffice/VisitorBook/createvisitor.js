import React, { useState } from 'react';
import './createvisitor.css';


const formElements = [
  {
    id: 'Purpose',
    label: 'Purpose',
    type: 'dropdown',
    options: ['Marketing', 'Parent Teacher Meeting', 'Student Meeting', 'Staff Meeting','Principal'],
    position: 'left',
    require: true
  },
  {
    id: 'VisitorName',
    label: 'Visitor Name',
    type: 'text',
    position: 'left',
    require: false
  },
  {
    id: 'Phone',
    label: 'Phone Number',
    type: 'text',
    position: 'left',
    require: true
  },
  {
    id: 'visitorType',
    label: 'Visitor Type',
    type: 'dropdown',
    options: ['Client', 'Vendor', 'Interviewee'],
    position: 'left',
    require: true
  },

  
     {
    id: 'time',
    label: 'In Time',
    type: 'time',
    position: 'left',
    require: true
  },
      {
    id: 'date',
    label: 'Date',
    type: 'date',
    position: 'left',
    require: true
  },


  {
    id: 'MeetingWith',
    label: 'Meeting With',
    type: 'dropdown',
    options: ['Staff', 'Student', 'Parent'],
    position: 'right',
    require: true
  },
  {
    id: 'Staff',
    label: 'Staff',
    type: 'dropdown',
    options: ['Meeting', 'Delivery', 'Interview'],
    position: 'right',
    require: true
  },
  {
    id: 'idcard',
    label: 'ID Card',
    type: 'text',
    position: 'right',
    require: true
  },
   {
    id: 'Numberpeson',
    label: 'Number Of Person',
    type: 'text',
    position: 'right',
    require: true
  },
       {
    id: 'time',
    label: 'Out Time',
    type: 'time',
    position: 'right',
    require: true
  },

  {
    id: 'fileUpload',
    label: 'Upload Documents',
    type: 'file',
    position: 'right',
    require: true
  },
   

  
    
];

export default function CreateVisitorBook() {
  const leftItems = formElements.filter((item) => item.position === 'left');
  const rightItems = formElements.filter((item) => item.position === 'right');


  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(''); 
  const validatePhone = (value)=>{
     if(value.length !== 10){
      setPhoneError('Mobile number should be exactly 10 digits')
     }else if(parseInt(value[0],10) < 6){
      setPhoneError('Mobile number should start with 6 or above')
     }else{
         setPhoneError('')
     }
  }

  const renderItem = (item) => {
    if (item.type === 'dropdown') {
      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <select id={item.id} name={item.id} className="dropdown">
            <option value="">--Select--</option>
            {item.options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );


    } if(item.type === 'text') {
       if (item.id === 'Phone') {
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
                // Only digits allowed
                const val = e.target.value.replace(/\D/g, '');
                setPhone(val);
                validatePhone(val);
              }}
            />
            {phoneError && <p className='error'>{phoneError}</p>}
          </div>
        );
      }
    }


    if(item.type === 'text') {
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
          />
        </div>
      );
    }


    if(item.type === 'date') {
      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <input
            type="date"
            id={item.id}
            name={item.id}
            className="text-input"
          />
        </div>
      );
    }

     if(item.type === 'time') {
      return (
        <div key={item.id} className="form-group">
          <label htmlFor={item.id}>
            {item.label}
            {item.require && <span className="required">*</span>}
          </label>
          <input
            type="time"
            id={item.id}
            name={item.id}
            className="text-input"
          />
        </div>
      );
    }

     if(item.type === 'file') {
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
          />
        </div>
      );
    }


  };

  return (

    <> <div className="header">Front Office → Visitor Book → Create New Visitor</div>
    <div className="container">
      <div className="left">
        {leftItems.map(renderItem)}
      </div>

      <div className="right">
        {rightItems.map(renderItem)}
        <div>
          <button className='submit' disabled={!!phoneError}>Submit</button>
        </div>
      </div>
    </div>
    </>
  );

}






