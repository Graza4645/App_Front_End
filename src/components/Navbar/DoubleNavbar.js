// // src/components/Navbar/DoubleNavbar.js
// import { useState } from 'react';
// import {
//   IconCalendarStats,
//   IconDeviceDesktopAnalytics,
//   IconFingerprint,
//   IconGauge,
//   IconHome2,
//   IconSettings,
//   IconUser,
// } from '@tabler/icons-react';
// import { Title, Tooltip, UnstyledButton } from '@mantine/core';
// import { MantineLogo } from '@mantinex/mantine-logo';
// import classes from './DoubleNavbar.module.css';

// const mainLinksMockdata = [
//   { icon: IconHome2, label: 'Home' },
//   { icon: IconGauge, label: 'Dashboard' },
//   { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
//   { icon: IconCalendarStats, label: 'Releases' },
//   { icon: IconUser, label: 'Account' },
//   { icon: IconFingerprint, label: 'Security' },
//   { icon: IconSettings, label: 'Settings' },
// ];

// const linksMockdata = [
//   'Security',
//   'Settings',
//   'Dashboard',
//   'Releases',
//   'Account',
//   'Orders',
//   'Clients',
//   'Databases',
//   'Pull Requests',
//   'Open Issues',
//   'Wiki pages',
// ];

// export function DoubleNavbar() {
//   const [active, setActive] = useState('Releases');
//   const [activeLink, setActiveLink] = useState('Settings');

//   const mainLinks = mainLinksMockdata.map((link) => (
//     <Tooltip
//       label={link.label}
//       position="right"
//       withArrow
//       transitionProps={{ duration: 0 }}
//       key={link.label}
//     >
//       <UnstyledButton
//         onClick={() => setActive(link.label)}
//         className={classes.mainLink}
//         data-active={link.label === active || undefined}
//       >
//         <link.icon size={22} stroke={1.5} />
//       </UnstyledButton>
//     </Tooltip>
//   ));

//   const links = linksMockdata.map((link) => (
//     <a
//       className={classes.link}
//       data-active={activeLink === link || undefined}
//       href="#"
//       onClick={(event) => {
//         event.preventDefault();
//         setActiveLink(link);
//       }}
//       key={link}
//     >
//       {link}
//     </a>
//   ));

//   return (
//     <nav className={classes.navbar}>
//       <div className={classes.wrapper}>
//         <div className={classes.aside}>
//           <div className={classes.logo}>
//             <MantineLogo type="mark" size={30} />
//           </div>
//           {mainLinks}
//         </div>
//         <div className={classes.main}>
//           <Title order={4} className={classes.title}>
//             {active}
//           </Title>
//           {links}
//         </div>
//       </div>
//     </nav>
//   );
// }






// src/components/Navbar/DoubleNavbar.js
// import { useState } from 'react';
// import {
//   IconCalendarStats,
//   IconDeviceDesktopAnalytics,
//   IconFingerprint,
//   IconGauge,
//   IconHome2,
//   IconSettings,
//   IconUser,
//   IconMenu2,
// } from '@tabler/icons-react';
// import { UnstyledButton } from '@mantine/core';
// import { MantineLogo } from '@mantinex/mantine-logo';
// import classes from './DoubleNavbar.module.css';

// const mainLinksMockdata = [
//   { icon: IconHome2, label: 'Home' },
//   { icon: IconGauge, label: 'Dashboard' },
//   { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
//   { icon: IconCalendarStats, label: 'Releases' },
//   { icon: IconUser, label: 'Account' },
//   { icon: IconFingerprint, label: 'Security' },
//   { icon: IconSettings, label: 'Settings' },
// ];

// export function DoubleNavbar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [active, setActive] = useState('Releases');

//   const mainLinks = mainLinksMockdata.map((link) => (
//     <UnstyledButton
//       onClick={() => setActive(link.label)}
//       className={`${classes.mainLink} ${active === link.label ? classes.active : ''}`}
//       key={link.label}
//     >
//       <link.icon size={22} stroke={1.5} />
//       {!collapsed && <span className={classes.linkLabel}>{link.label}</span>}
//     </UnstyledButton>
//   ));

//   return (
//     <nav className={`${classes.navbar} ${collapsed ? classes.collapsed : classes.expanded}`}>
//       <div className={classes.topSection}>
//         <UnstyledButton onClick={() => setCollapsed((c) => !c)} className={classes.toggleButton}>
//           <IconMenu2 size={20} />
//         </UnstyledButton>
//         {!collapsed && (
//           <div className={classes.logo}>
//             <MantineLogo type="mark" size={30} />
//           </div>
//         )}
//       </div>

//       <div className={classes.linksContainer}>{mainLinks}</div>

//       {!collapsed && (
//         <div className={classes.bottomInfo}>
//           {/* <strong>😊 And we have</strong>
//           <p>components + emoji + image</p> */}
//         </div>
//       )}
//     </nav>
//   );
// }






import { useState } from 'react';
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

  return (
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
  );
}
