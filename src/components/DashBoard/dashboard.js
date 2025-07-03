import React from 'react';
import dashboardImage from './details.png'; // ✅ correct relative path

export default function Dashboard() {
  return (
    <img
      src={dashboardImage}
      alt="Dashboard"
      style={{ width: '100%' }}
    />
  );
}
