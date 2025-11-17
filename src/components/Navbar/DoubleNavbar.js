

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UnstyledButton, Tooltip } from '@mantine/core';
import classes from './DoubleNavbar.module.css';
import { useNavigate } from 'react-router-dom';
import AdmissionEnquiry from '../FrontOffice/Admission_Enquiry/admissionEnquiry';
import Dashboard from '../DashBoard/dashboard';
import VisitorBook from '../FrontOffice/VisitorBook/visitorbook.js';
import CreateVisitorBook from '../FrontOffice/VisitorBook/createvisitor.js';
import AdmissionEnquiryForm from '../FrontOffice/Admission_Enquiry/createadmission.js';
import PhoneCallLog from '../FrontOffice/Phonecalllog/phonecall.js';
import PostalDispatch from '../FrontOffice/Postal Dispatch/postaldispatch.js';
import PostalReceive from '../FrontOffice/Postal Receive/postalreceive.js';
import Complain from '../FrontOffice/Complain/complain.js';

// Simple icon components using Unicode symbols
const IconDashboard = ({ size = 20 }) => <span style={{ fontSize: size }}>📊</span>;
const IconFrontOffice = ({ size = 20 }) => <span style={{ fontSize: size }}>🏢</span>;
const IconStudent = ({ size = 20 }) => <span style={{ fontSize: size }}>🎓</span>;
const IconFee = ({ size = 20 }) => <span style={{ fontSize: size }}>💰</span>;
const IconIncome = ({ size = 20 }) => <span style={{ fontSize: size }}>📈</span>;
const IconExpenses = ({ size = 20 }) => <span style={{ fontSize: size }}>📉</span>;
const IconExam = ({ size = 20 }) => <span style={{ fontSize: size }}>📝</span>;
const IconAttendance = ({ size = 20 }) => <span style={{ fontSize: size }}>✅</span>;
const IconMenu2 = ({ size = 20 }) => <span style={{ fontSize: size }}>☰</span>;








const mainLinksMockdata = [
   {
    icon: IconDashboard,
    label: 'DashBoard', route : '/dashboard',
    subLinks: [
      //{ label: 'Student In Progress..' },
    
    ],
  },
  {
    icon: IconFrontOffice,
    label: 'Front Office',
    subLinks: [
      { label: 'Admission Enquiry',route:'/admission-enquiry' },   // step-1 
      { label: 'Visitor Book' , route: '/visitorbook' },
      { label: 'Phone Call Log', route : '/phoneCallLog' },
      { label: 'Postal Dispatch', route : '/postaldispatch' },
      { label: 'Postal Receive', route : '/postalreceive' },
      { label: 'Complain' , route : '/complain'},
      { label: 'Setup Front Office' },
    ],
  },
  {
    icon: IconStudent,
    label: 'Student Information',
    subLinks: [
      { label: 'Student In Progress..' },
    
    ],
  },
  {
    icon: IconFee,
    label: 'Fee Collection',
    subLinks: [
      { label: 'Fee In Progress..' },
    ],
  },
  {
    icon: IconIncome,
    label: 'Income',
    subLinks: [
      { label: 'Income In Progress..' },
    ],
  },
  {
    icon: IconExpenses,
    label: 'Expenses',
    subLinks: [
      { label: 'Expenses In Progress..' },
    ],
  },
  {
    icon: IconExam,
    label: 'Examinations',
    subLinks: [
      { label: 'Examinations In Progress..' },
    ],
  },
  {
    icon: IconAttendance,
    label: 'Attendance',
    subLinks: [
      { label: 'Attendance In Progress..' },
    ],
  },
];

export function DoubleNavbar() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeMain, setActiveMain] = useState('Front Office');
  const [activeSub, setActiveSub] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  // const [openSubmenus, setOpenSubmenus] = useState({});

  const [openMenuLabel, setOpenMenuLabel] = useState('');

  const navigate = useNavigate();

const toggleSubmenu = (label) => {
  setOpenMenuLabel((prev) => (prev === label ? '' : label));
};

function handleClick(route) {
  if(route) navigate(route)
}

  const mainLinks = mainLinksMockdata.map((link) => {
    const hasSubLinks = link.subLinks && link.subLinks.length > 0;
   const isOpen = openMenuLabel === link.label;

    return (
      <div key={link.label}>
        <UnstyledButton
         onClick={() => {
  if (hasSubLinks) {
    toggleSubmenu(link.label);
    setActiveMain(link.label);
    setActiveSub('');
  } else {
    setActiveMain(link.label);
    setActiveSub('');
    setOpenMenuLabel('');
    handleClick(link.route); 
  }
}}
          className={`${classes.mainLink} ${activeMain === link.label ? classes.active : ''}`}
        >
          <span className={classes.iconWrapper} onClick={() => {
            if (collapsed && hasSubLinks) {
              setCollapsed(false);
              toggleSubmenu(link.label);
              setActiveMain(link.label);
              setActiveSub('');
            } else if (collapsed && !hasSubLinks) {
              handleClick(link.route);
            }
          }}>
            {collapsed ? (
              <Tooltip label={link.label} position="right" withArrow>
                <link.icon size={20} stroke={1.5} />
              </Tooltip>
            ) : (
              <link.icon size={20} stroke={1.5} />
            )}
          </span>

          {!collapsed && (
            <span className={classes.linkLabelWrapper}>
              <span className={classes.linkLabel}>{link.label}</span>
              {hasSubLinks && (
                <span className={classes.submenuArrow}>{isOpen ? '▼' : '▶'}</span>
              )}
            </span>
          )}
        </UnstyledButton>

        {!collapsed && isOpen && hasSubLinks && (
          <div className={classes.subLinkGroup}>
            {link.subLinks.map((sub) => (
              <div
                key={sub.label}
                className={`${classes.subLink} ${
                  activeSub === sub.label ? classes.activeSub : ''
                }`}
                onClick={() => {
                  setActiveSub(sub.label);
                  setActiveMain(link.label);
                  handleClick(sub.route)
                }}
              >
                {sub.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.topDiv}>
      <nav
        className={`${classes.navbar} ${
          collapsed ? classes.collapsed : classes.expanded
        }`}
      >
        <div className={classes.topSection}>
          <UnstyledButton
            onClick={() => setCollapsed((c) => !c)}
            className={classes.toggleButton}
          >
            <IconMenu2 size={20} />
          </UnstyledButton>
          {!collapsed && (
            <div className={classes.logo}>
              {/* <img src="./header.png" alt="Logo" style={{ width: '160px' }} /> */}
            </div>
          )}
        </div>

        <div className={classes.linksContainer}>{mainLinks}</div>

        {!collapsed && <div className={classes.bottomInfo}></div>}
      </nav>

      <div className={classes.sideparent}>
        <div className={classes.header}>
          <div className={classes.logout}>{currentDate}</div>
        </div>

        <div
          className={classes.consumerparent}
          style={{ height: '100%' }}
        >
          {/* <h1
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            Details
          </h1> */}
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/admission-enquiry" element={<AdmissionEnquiry/>} />
          <Route path="/visitorbook" element={<VisitorBook/>} />
          <Route path="/createvisitor" element={<CreateVisitorBook/>}/>
          <Route path="/admissionform" element={<AdmissionEnquiryForm/>}/>
           <Route path="/phoneCallLog" element={<PhoneCallLog/>}/>
            <Route path="/postaldispatch" element={<PostalDispatch/>}/>
           <Route path="/postalreceive" element={<PostalReceive/>}/>
            <Route path="/complain" element={<Complain/>}/>


           

             




          


          
        </Routes>
        </div>
      </div>
    </div>
  );
}
