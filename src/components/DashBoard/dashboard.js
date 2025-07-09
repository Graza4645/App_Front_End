import React from 'react';
import dashboardImage from './hd.jpg'; // ✅ correct relative path

export default function Dashboard() {
  return (
    <img
      src={dashboardImage}
      alt="Dashboard"
      style={{ width: '100%' }}
    />
  );
}
