// import React from 'react';
// import dashboardImage from './new.jpg'; // ✅ correct relative path

// export default function Dashboard() {
//   return (
//     <img
//       src={dashboardImage}
//       alt="Dashboard"
//       style={{ width: '100%' , height : '100%' , overflow : 'hidden' }}
//     />
//   );
// }


import React from 'react';
import dashboardImage from './new.jpg'; // ✅ correct relative path

export default function Dashboard() {
  return (
    <img
      src={dashboardImage}
      alt="Dashboard"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',  
        display: 'block',    
      }}
    />
  );
}
