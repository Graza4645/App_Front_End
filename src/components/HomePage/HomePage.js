import React, { useState } from "react";
import './HomePage.css';

export default function Home() {
  const [openStudentSubmenu, setOpenStudentSubmenu] = useState(false);
  const [isStudentOpen, setStudentIsOpen] = useState(false);

  const [isClassOpen, setClassIsOpen] = useState(false);



  return (
    <>
      <div className="containerparent">

        {/* Left Side - Sidebar */}
        <div className="Leftsideparent">

          <div id="sidebarparent">

            {/* Logo/Header image */}
            <div className="sideitem"><img src="/header.png" alt="Header" className="imageheader" /></div>

            {/* Student registration - Click to toggle submenu */}
           
            <div className="sideitem" onClick={() => {setOpenStudentSubmenu(!openStudentSubmenu); setStudentIsOpen(!isStudentOpen); }} style={{ cursor: 'pointer' }} >
              <span className="sidetext">🎓  Student registration and profile{isStudentOpen ? '🔽' : '▶️'}</span>
            </div>

            {/* Submenu items - show only when openSubmenu is true */}
            {openStudentSubmenu && (
              <div className="submenu">
                <div className="submenuitem">👤 Personal Info</div>
                <div className="submenuitem">🏫 Education Info</div>
                <div className="submenuitem">📄 Document Upload</div>
                <div className="submenuitem">📞 Contact Details</div>
              </div>
            )}

            {/* Other main sidebar items */}
            <div className="sideitem"  onClick={() => setClassIsOpen(!isClassOpen)} style={{ cursor: 'pointer' }}><span className="sidetext">📚 Class and schedule management{isClassOpen ? '🔽' : '▶️'}</span></div>
            
            <div className="sideitem"><span className="sidetext">🕒 Attendance tracking</span></div>
            <div className="sideitem"><span className="sidetext">📝 Examination and grading</span></div>
            <div className="sideitem"><span className="sidetext">💬 Communication module</span></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="rightsideparent">
          <div id="rightsideheader">
            <div className="headeritem"><input className="headerCheckbox" placeholder="Search Your Concern"></input></div>
            <div className="headeritem"><input className="headerCheckbox" placeholder="Search Your Concern"></input></div>
          </div>


          <div id="consumermain">consumer</div>
        </div>
      </div>
    </>
  );
}
