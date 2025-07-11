import './visitorbook.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function VisitorBook() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const [studentRes, staffRes] = await Promise.all([
          fetch('http://localhost:3000/getvisitorStudent'),
          fetch('http://localhost:3000/getvisitorStaff'),
        ]);

        const studentData = await studentRes.json();
        const staffData = await staffRes.json();

        // Normalize student and staff entries to a common structure
        const normalizedStudents = studentData.map((entry) => ({
          purpose: entry.purpose,
          meeting_with: 'Student',
          visitor_name: entry.visitor_name,
          phone_number: entry.phone_number,
          id_card: entry.id_card,
          number_of_person: entry.number_of_person,
          date: entry.date,
          in_time: entry.in_time,
          out_time: entry.out_time,
        }));

        const normalizedStaff = staffData.map((entry) => ({
          purpose: entry.purpose,
          meeting_with: entry.meeting_with,
          visitor_name: entry.visitor_name,
          phone_number: entry.phone_number,
          id_card: entry.id_card,
          number_of_person: entry.number_of_person,
          date: entry.date,
          in_time: entry.in_time,
          out_time: entry.out_time,
        }));

        setVisitors([...normalizedStudents, ...normalizedStaff]);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchVisitors();
  }, []);

  const handleExport = (type) => {
    let url = '';
    let filename = '';

    switch (type) {
      case 'pdf':
        url = '/file/pdfone.pdf';
        filename = 'VisitorData.pdf';
        break;
      case 'excel':
        url = '/file/excel.xlsx';
        filename = 'VisitorData.xlsx';
        break;
      case 'csv':
        url = '/file/csvfie.csv';
        filename = 'VisitorData.csv';
        break;
      default:
        return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className='table-container'>
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
                  <td>{visitor.purpose}</td>
                  <td>{visitor.meeting_with}</td>
                  <td>{visitor.visitor_name}</td>
                  <td>{visitor.phone_number}</td>
                  <td>{visitor.id_card}</td>
                  <td>{visitor.number_of_person}</td>
                  <td>{visitor.date}</td>
                  <td>{visitor.in_time}</td>
                  <td>{visitor.out_time}</td>
                  <td>Edit | Delete</td>
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
