// import './visitorbook.css';
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// export default function VisitorBook() {
//   const navigate = useNavigate();
//   const [visitors, setVisitors] = useState([]);

//   useEffect(() => {
//     const fetchVisitors = async () => {
//       try {
//           const studentRes = await fetch('http://localhost:3000/getvisitorStudent');
//           const studentData = await studentRes.json();
//           const staffRes = await fetch('http://localhost:3000/getvisitorStaff');
//           const staffData = await staffRes.json();
//           const allVisitors = [...(studentData || []), ...(staffData || [])];
//         setVisitors(allVisitors);
//       } catch (error) {
//         console.error('Error fetching visitor data:', error);
//       }
//     };

//     fetchVisitors();
//   }, []);

//   const handleExport = (type) => {
//     let url = '';
//     let filename = '';

//     switch (type) {
//       case 'pdf':
//         url = '/file/pdfone.pdf';
//         filename = 'VisitorData.pdf';
//         break;
//       case 'excel':
//         url = '/file/excel.xlsx';
//         filename = 'VisitorData.xlsx';
//         break;
//       case 'csv':
//         url = '/file/csvfie.csv';
//         filename = 'VisitorData.csv';
//         break;
//       default:
//         return;
//     }

//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <>
//       <div className='createbutton'>
//         <div className='leftvistor'>Front Office → Visitor Book</div>

//         <div className='rightvisitor'>
//           <div className='icon-toolbar'>
//             <span className='icon-container' title='Copy (Coming Soon)'>
//               <i className='fas fa-copy'></i>
//               <span className='tooltip'>Copy</span>
//             </span>
//             <span className='icon-container' onClick={() => handleExport('excel')}>
//               <i className='fas fa-file-excel'></i>
//               <span className='tooltip'>Excel</span>
//             </span>
//             <span className='icon-container' onClick={() => handleExport('csv')}>
//               <i className='fas fa-file-csv'></i>
//               <span className='tooltip'>CSV</span>
//             </span>
//             <span className='icon-container' onClick={() => handleExport('pdf')}>
//               <i className='fas fa-file-pdf'></i>
//               <span className='tooltip'>PDF</span>
//             </span>
//             <span className='icon-container' onClick={handlePrint}>
//               <i className='fas fa-print'></i>
//               <span className='tooltip'>Print</span>
//             </span>
//             <button type='button' className='create' onClick={() => navigate('/createvisitor')}>
//               Create New +
//             </button>
//           </div>
//         </div>
//       </div>

//       <main>
//         <div className='table-container'>
//           <table>
//             <thead>
//               <tr>
//                 <th>Purpose</th>
//                 <th>Meeting With</th>
//                 <th>Visitor Name</th>
//                 <th>Phone</th>
//                 <th>ID Card</th>
//                 <th>Number Of Person</th>
//                 <th>Date</th>
//                 <th>In Time</th>
//                 <th>Out Time</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visitors.map((visitor, index) => (
//                 <tr key={index}>
//                   <td>{visitor.purpose || 'N/A'}</td>
//                   <td>{visitor.meeting_with || visitor.meetingwith || 'N/A'}</td>
//                   <td>{visitor.visitor_name || visitor.staff || visitor.student || 'N/A'}</td>
//                   <td>{visitor.phone_number || visitor.phonenumber || 'N/A'}</td>
//                   <td>{visitor.id_card || visitor.idcard || 'N/A'}</td>
//                   <td>{visitor.number_of_person || visitor.numberofpersons || 'N/A'}</td>
//                   <td>{visitor.date || 'N/A'}</td>
//                   <td>{visitor.in_time || visitor.intime || 'N/A'}</td>
//                   <td>{visitor.out_time || visitor.outtime || 'N/A'}</td>
//                   <td>Edit | Delete</td>
//                 </tr>
//               ))}
//               {visitors.length === 0 && (
//                 <tr>
//                   <td colSpan='10'>No visitor data available.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </>
//   );
// }



import './visitorbook.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export default function VisitorBook() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const studentRes = await fetch('http://localhost:3000/getvisitorStudent');
        const studentData = await studentRes.json();
        const staffRes = await fetch('http://localhost:3000/getvisitorStaff');
        const staffData = await staffRes.json();
        const allVisitors = [...(studentData || []), ...(staffData || [])];
        setVisitors(allVisitors);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchVisitors();
  }, []);



const handleDelete = async (visitor) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete ${visitor.visitor_name || visitor.staff || visitor.student}?`);

  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:3000/deleteVisitor/${visitor.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete visitor');
    }

    // Remove from local state
    setVisitors((prev) => prev.filter((v) => v.id !== visitor.id));

    alert('Visitor deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    alert('Error deleting visitor');
  }
};


const handleEdit = async (visitor) => {
  // Optional: prompt or pre-fill form (use modal in real apps)
  const updatedName = prompt("Edit visitor name:", visitor.visitor_name || visitor.staff || visitor.student);

  if (!updatedName || updatedName.trim() === "") return;

  try {
    const updatedVisitor = {
      ...visitor,
      visitor_name: updatedName, // Modify only the field you're updating
    };

    const response = await fetch(`http://localhost:3000/updateVisitor/${visitor.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedVisitor),
    });

    if (!response.ok) throw new Error('Failed to update visitor');

    // Update local state
    setVisitors((prev) =>
      prev.map((v) => (v.id === visitor.id ? updatedVisitor : v))
    );

    alert("Visitor updated successfully!");
  } catch (err) {
    console.error("Error updating visitor:", err);
    alert("Update failed!");
  }
};



  const normalizeData = (data) => {
    return data.map((visitor) => ({
      Purpose: visitor.purpose || 'N/A',
      'Meeting With': visitor.meeting_with || visitor.meetingwith || 'N/A',
      'Visitor Name': visitor.visitor_name || visitor.staff || visitor.student || 'N/A',
      Phone: visitor.phone_number || visitor.phonenumber || 'N/A',
      'ID Card': visitor.id_card || visitor.idcard || 'N/A',
      'Number Of Person': visitor.number_of_person || visitor.numberofpersons || 'N/A',
      Date: visitor.date || 'N/A',
      'In Time': visitor.in_time || visitor.intime || 'N/A',
      'Out Time': visitor.out_time || visitor.outtime || 'N/A',
    }));
  };

  const handleExport = (type) => {
    const exportData = normalizeData(visitors);

    if (type === 'excel' || type === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');

      if (type === 'csv') {
        XLSX.writeFile(workbook, 'VisitorData.csv', { bookType: 'csv' });
      } else {
        XLSX.writeFile(workbook, 'VisitorData.xlsx', { bookType: 'xlsx' });
      }
    }

   if (type === 'pdf') {
  const doc = new jsPDF();
  doc.text('Visitor Data', 14, 15);

  const headers = [Object.keys(exportData[0] || {})];
  const body = exportData.map((row) => Object.values(row));

  autoTable(doc, {
    head: headers,
    body: body,
    startY: 20,
    styles: { fontSize: 8 },
  });

  doc.save('VisitorData.pdf');
}

  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className='createbutton'>
        <div className='leftvistor'>Front Office → Visitor Book</div>

        <div className='rightvisitor'>
          <div className='icon-toolbar'>
            <span className='icon-container' title='Copy (Coming Soon)'>
              <i className='fas fa-copy'></i>
              <span className='tooltip'>Copy</span>
            </span>
            <span className='icon-container' onClick={() => handleExport('excel')}>
              <i className='fas fa-file-excel'></i>
              <span className='tooltip'>Excel</span>
            </span>
            <span className='icon-container' onClick={() => handleExport('csv')}>
              <i className='fas fa-file-csv'></i>
              <span className='tooltip'>CSV</span>
            </span>
            <span className='icon-container' onClick={() => handleExport('pdf')}>
              <i className='fas fa-file-pdf'></i>
              <span className='tooltip'>PDF</span>
            </span>
            <span className='icon-container' onClick={handlePrint}>
              <i className='fas fa-print'></i>
              <span className='tooltip'>Print</span>
            </span>
            <button type='button' className='create' onClick={() => navigate('/createvisitor')}>
              Create New +
            </button>
          </div>
        </div>
      </div>

      <main>
        <div id="printArea"  className='table-container'>
          <table>
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Meeting With</th>
                <th>Visitor Name</th>
                <th>Phone</th>
                <th>ID Card</th>
                <th>Number Of Person</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor, index) => (
                <tr key={index}>
                  <td>{visitor.purpose || 'N/A'}</td>
                  <td>{visitor.meeting_with || visitor.meetingwith || 'N/A'}</td>
                  <td>{visitor.visitor_name || visitor.staff || visitor.student || 'N/A'}</td>
                  <td>{visitor.phone_number || visitor.phonenumber || 'N/A'}</td>
                  <td>{visitor.id_card || visitor.idcard || 'N/A'}</td>
                  <td>{visitor.number_of_person || visitor.numberofpersons || 'N/A'}</td>
                  <td>{visitor.date || 'N/A'}</td>
                  <td>{visitor.in_time || visitor.intime || 'N/A'}</td>
                  <td>{visitor.out_time || visitor.outtime || 'N/A'}</td>
                  <td>
                      <div className="action-menu">
                        <i className="fas fa-ellipsis-v"></i>
                        <div className="dropdown-content">
                          <div onClick={() => handleEdit(visitor)}>Edit</div>
                          <div onClick={() => handleDelete(visitor)}>Delete</div>
                        </div>
                      </div>
                    </td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan='10'>No visitor data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
