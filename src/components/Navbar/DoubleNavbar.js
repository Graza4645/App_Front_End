import { useEffect, useState } from 'react';
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconSettings,
  IconUser,
  IconMenu2,
} from '@tabler/icons-react';
import { UnstyledButton, Tooltip } from '@mantine/core';
// import { MantineLogo } from '@mantinex/mantine-logo';
// import headerLogo from './header.png';
import classes from './DoubleNavbar.module.css';

const mainLinksMockdata = [
  { icon: IconHome2, label: 'Student registration' },
  { icon: IconGauge, label: 'profile management' },
  { icon: IconDeviceDesktopAnalytics, label: 'Attendance tracking' },
  { icon: IconCalendarStats, label: 'Examination and grading system' },
  { icon: IconUser, label: 'Communication module' },
  { icon: IconFingerprint, label: 'Parent portal access' },
  { icon: IconSettings, label: 'Settings' },
];

export function DoubleNavbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Releases');
  const [currentDate,setCurrentDate] = useState()

  const mainLinks = mainLinksMockdata.map((link) => {
    const button = (
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className={`${classes.mainLink} ${active === link.label ? classes.active : ''}`}
        key={link.label}
      >
        <link.icon size={22} stroke={1.5} />
        {!collapsed && <span className={classes.linkLabel}>{link.label}</span>}
      </UnstyledButton>
    );

    return collapsed ? (
      <Tooltip label={link.label} position="right" withArrow key={link.label}>
        {button}
      </Tooltip>
    ) : (
      <div key={link.label}>{button}</div>
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

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);


  return (
    <div className={classes.topDiv}>
    <nav className={`${classes.navbar} ${collapsed ? classes.collapsed : classes.expanded}`}>
      <div className={classes.topSection}>
        <UnstyledButton onClick={() => setCollapsed((c) => !c)} className={classes.toggleButton}>
          <IconMenu2 size={20} />
        </UnstyledButton>
       {!collapsed && (
  <div className={classes.logo}>
    <img src="./header.png" alt="Logo" style={{width: '160px'}} />
  </div>
)}
      </div>

      <div className={classes.linksContainer}>{mainLinks}</div>

      {!collapsed && (
        <div className={classes.bottomInfo}>
          {/* <strong>😊 And we have</strong>
          <p>components + emoji + image</p> */}
        </div>
      )}
    </nav>
    <div style={{width:'100%'}}>
     <div className={classes.header}>
       <div className={classes.logout}>
           {currentDate}
       </div>

     </div>
     <div style={{height:'100%'}}>
      <h1 style={{textAlign:'center',display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>Details</h1>
     </div>
    </div>
    </div>
  );
}
