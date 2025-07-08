import './visitorbook.css';
import { useNavigate } from 'react-router-dom';

export default function VisitorBook() {
  const navigate = useNavigate();

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
        <span>Front Office → Visitor Book</span>
        <div className="icon-toolbar">
          <span className="icon-container" title="Copy (Coming Soon)">
            <i className="fas fa-copy"></i>
            <span className="tooltip">Copy</span>
          </span>
          <span className="icon-container" onClick={() => handleExport('excel')}>
            <i className="fas fa-file-excel"></i>
            <span className="tooltip">Excel</span>
          </span>
          <span className="icon-container" onClick={() => handleExport('csv')}>
            <i className="fas fa-file-csv"></i>
            <span className="tooltip">CSV</span>
          </span>
          <span className="icon-container" onClick={() => handleExport('pdf')}>
            <i className="fas fa-file-pdf"></i>
            <span className="tooltip">PDF</span>
          </span>
          <span className="icon-container" onClick={handlePrint}>
            <i className="fas fa-print"></i>
            <span className="tooltip">Print</span>
          </span>
        </div>

        <button type='button' onClick={() => navigate('/createvisitor')}>
          Create New +
        </button>
      </div>

      <main>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Meeting With</th>
                <th>Visitor Name</th>
                <th>Phone</th>
                <th>Id card</th>
                <th>Number OF Person</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>To enquire about admission & fee structure</td>
                <td>Principal</td>
                <td>John Doe</td>
                <td>9876543210</td>
                <td>Voter ID</td>
                <td>2</td>
                <td>2025-07-03</td>
                <td>10:00 AM</td>
                <td>10:30 AM</td>
                <td>Edit | Delete</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
