



// =====================================================
//  REACT & ROUTER IMPORTS
// =====================================================
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UnstyledButton, Tooltip } from '@mantine/core';
import classes from './DoubleNavbar.module.css';
import { useNavigate } from 'react-router-dom';
// import { Tooltip } from '@mantine/core';

// =====================================================
//  PAGE IMPORTS
// =====================================================
import AdmissionEnquiry from '../FrontOffice/Admission_Enquiry/admissionEnquiry';
import Dashboard from '../DashBoard/dashboard';
import VisitorBook from '../FrontOffice/VisitorBook/visitorbook.js';
import CreateVisitorBook from '../FrontOffice/VisitorBook/createvisitor.js';
import EditVisitor from '../FrontOffice/VisitorBook/EditVisitor.js';
import AdmissionEnquiryForm from '../FrontOffice/Admission_Enquiry/createadmission.js';
import PhoneCallLog from '../FrontOffice/Phonecalllog/phonecall.js';
import PostalDispatch from '../FrontOffice/Postal Dispatch/postaldispatch.js';
import PostalReceive from '../FrontOffice/Postal Receive/postalreceive.js';
import Complain from '../FrontOffice/Complain/complain.js';
// import roomtype from '../Hostel/Room_Type/roomtype.js';

// =====================================================
//  ICON IMPORTS (Lucide)
// =====================================================
import { Home, Users, BookOpen, DollarSign, BarChart2, FileMinus, ClipboardCheck, Calendar, Menu, Building} from "lucide-react";
import Roomtype from '../Hostel/Room_Type/roomtype.js';
import HostelRoom from '../Hostel/Hostel_Room/hostelroom.js';
import Hostel from '../Hostel/Hostel/hostel.js';

// =====================================================
//  ICON COMPONENTS (NEW COLORFUL SET)
// =====================================================
export const IconDashboard = ({ size = 20 }) => <Home size={size} color="#607D8B" />;
export const IconFrontOffice = ({ size = 20 }) => <Users size={size} color="#607D8B" />;
export const IconStudent = ({ size = 20 }) => <BookOpen size={size} color="#607D8B" />;
export const IconFee = ({ size = 20 }) => <DollarSign size={size} color="#607D8B" />;
export const IconIncome = ({ size = 20 }) => <BarChart2 size={size} color="#607D8B" />;
export const IconExpenses = ({ size = 20 }) => <FileMinus size={size} color="#607D8B" />;
export const IconExam = ({ size = 20 }) => <ClipboardCheck size={size} color="#607D8B" />;
export const IconAttendance = ({ size = 20 }) => <Calendar size={size} color="#607D8B" />;
export const IconMenu2 = ({ size = 20 }) => <Menu size={size} color="#607D8B" />;
export const IconHostel = ({ size = 20 }) => <Building size={size} color="#607D8B" />;

// =====================================================
//  MENU DATA WITH NEW ICONS
// =====================================================
const mainLinksMockdata = [
  {
    icon: IconDashboard,
    label: 'DashBoard',
    route: '/dashboard',
    subLinks: [],
  },
  {
    icon: IconFrontOffice,
    label: 'Front Office',
    subLinks: [
      { label: 'Admission Enquiry', route:'/admission-enquiry' },
      { label: 'Visitor Book', route: '/visitorbook' },
      { label: 'Phone Call Log', route : '/phoneCallLog' },
      { label: 'Postal Dispatch', route : '/postaldispatch' },
      { label: 'Postal Receive', route : '/postalreceive' },
      { label: 'Complain', route : '/complain'},
      { label: 'Setup Front Office', route : '/setup/front/office'},
    ],
  },
  {
    icon: IconStudent,
    label: 'Student Information',
    subLinks: [{ label: 'Student In Progress..' }],
  },
  {
    icon: IconFee,
    label: 'Fee Collection',
    subLinks: [{ label: 'Fee In Progress..' }],
  },
  {
    icon: IconIncome,
    label: 'Income',
    subLinks: [{ label: 'Income In Progress..' }],
  },
  {
    icon: IconExpenses,
    label: 'Expenses',
    subLinks: [{ label: 'Expenses In Progress..' }],
  },
  {
    icon: IconExam,
    label: 'Examinations',
    subLinks: [{ label: 'Examinations In Progress..' }],
  },
  {
    icon: IconAttendance,
    label: 'Attendance',
    subLinks: [{ label: 'Attendance In Progress..' }],
  },
   {
    icon: IconHostel,
    label: 'Hostle',
    subLinks: [
          { label: 'Hostel Rooms', route: '/hostel/rooms' },
          { label: 'Room Type', route: '/hostel/room-types' },
          { label: 'Hostel', route: '/hostel' },
          { label: 'Fee Master', route: '/fees/master' },
          { label: 'Student Hostel Fee', route: '/fees/student-hostel' }
      ],
    }
  ];

// =====================================================
//  COMPONENT: DoubleNavbar
// =====================================================
export function DoubleNavbar() {

  const [collapsed, setCollapsed] = useState(true);
  const [activeMain, setActiveMain] = useState('DashBoard');
  const [activeSub, setActiveSub] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [openMenuLabel, setOpenMenuLabel] = useState('');

  const navigate = useNavigate();

  const toggleSubmenu = (label) => setOpenMenuLabel(prev => prev === label ? '' : label);

  function handleClick(route) {
    if(route) navigate(route);
  }

  // ============================
  //  MAP MENU LINKS
  // ============================
  const mainLinks = mainLinksMockdata.map(link => {
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

          {/* ICON */}
          <span className={classes.iconWrapper}
            onClick={() => {
              if (collapsed && hasSubLinks) {
                setCollapsed(false);
                toggleSubmenu(link.label);
              } else if (collapsed && !hasSubLinks) {
                handleClick(link.route);
              }
            }}
          >
            {collapsed ? (
              <Tooltip label={link.label} position="right" withArrow style={{backgroundColor : "#757575"}}>
                <div>
                  <link.icon size={20} />
                </div>
              </Tooltip>
            ) : (
              <link.icon size={20} />
            )}
          </span>

          {/* LABEL */}
          {!collapsed && (
            <span className={classes.linkLabelWrapper}>
              <span className={classes.linkLabel}>{link.label}</span>
              {hasSubLinks && <span className={classes.submenuArrow}>{isOpen ? '▼' : '▶'}</span>}
            </span>
          )}
        </UnstyledButton>

        {/* SUBMENU */}
        {!collapsed && isOpen && hasSubLinks && (
          <div className={classes.subLinkGroup}>
            {link.subLinks.map(sub => (
              <div
                key={sub.label}
                className={`${classes.subLink} ${activeSub === sub.label || window.location.pathname === sub.route ? classes.activeSub : ''}`}
                onClick={() => {
                  setActiveSub(sub.label);
                  setActiveMain(link.label);
                  handleClick(sub.route);
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

  // ============================
  //  CLOCK
  // ============================
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // ============================
  //  RETURN JSX
  // ============================
  return (
    <div className={classes.topDiv}>

      {/* SIDEBAR */}
      <nav className={`${classes.navbar} ${collapsed ? classes.collapsed : classes.expanded}`}>
        <div className={classes.topSection}>
          <UnstyledButton
            onClick={() => setCollapsed(c => !c)}
            className={classes.toggleButton}
          >
            <Tooltip label="Menu" position="right" withArrow style={{backgroundColor : "#757575"}}>
              <div>
                <IconMenu2 size={20} />
              </div>
            </Tooltip>
          </UnstyledButton>
        </div>
        <div className={classes.linksContainer}>{mainLinks}</div>
      </nav>

      {/* PAGE CONTENT */}
      <div className={classes.sideparent}>
        <div className={classes.header}>
          <div className={classes.logout}>{currentDate}</div>
        </div>

        <div className={classes.consumerparent} style={{ height: '100%' }}>
          <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/admission-enquiry" element={<AdmissionEnquiry/>} />
            <Route path="/visitorbook" element={<VisitorBook/>} />
            <Route path="/createvisitor" element={<CreateVisitorBook/>}/>
            <Route path="/editvisitor" element={<EditVisitor/>}/>
            <Route path="/admissionform" element={<AdmissionEnquiryForm/>}/>
            <Route path="/phoneCallLog" element={<PhoneCallLog/>}/>
            <Route path="/postaldispatch" element={<PostalDispatch/>}/>
            <Route path="/postalreceive" element={<PostalReceive/>}/>
            <Route path="/complain" element={<Complain/>}/>
            <Route path="/setup/front/office" element={<Dashboard/>}/>

             
             <Route path="/hostel/rooms" element={<HostelRoom/>}/>
            <Route path="/hostel/room-types" element={<Roomtype/>}/>
            <Route path="/hostel" element={<Hostel/>}/>
            <Route path="/fees/master" element={<Dashboard/>}/>
            <Route path="/fees/student-hostel" element={<Dashboard/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}
