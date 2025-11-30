import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import './VisitorToolbar.css';

export default function VisitorToolbar({ visitors, columns, fileName = "visitor_book_data", onAlert }) {
  const headers = columns.map(col => col.label); // display names

  const showAlert = (message, type = 'success') => {
    if (onAlert && typeof onAlert === 'function') {
      onAlert(message, type);
    } else {
      alert(message);
    }
  };

  const handleCopy = () => {
    if (!visitors.length) return showAlert("No data to copy", 'error');

    const tsvContent = [
      headers.join("\t"),
      ...visitors.map(v =>
        columns.map(col => v[col.key] ?? "N/A").join("\t")
      ),
    ].join("\n");

    navigator.clipboard
      .writeText(tsvContent)
      .then(() => showAlert("Data copied to clipboard!"))
      .catch(err => {
        console.error("Failed to copy:", err);
        showAlert("Failed to copy data.", 'error');
      });
  };

  const handleExport = (type) => {
    if (!visitors.length) return showAlert("No data to export", 'error');

    if (type === "excel" || type === "csv") {
      // Prepare data with headers
      const exportData = [
        headers, // Header row
        ...visitors.map(v => 
          columns.map(col => v[col.key] ?? "N/A")
        )
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, fileName.toLowerCase());
      XLSX.writeFile(workbook, `${fileName}.${type === "csv" ? "csv" : "xlsx"}`);
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      const pdfTitle = fileName.toLowerCase().replace('_data', '').replace(/_/g, ' ');
      doc.text(pdfTitle, 14, 15);
      autoTable(doc, {
        head: [headers],
        body: visitors.map(v => columns.map(col => v[col.key] ?? "N/A")),
        startY: 20,
        styles: { fontSize: 8 },
      });
      doc.save(`${fileName}.pdf`);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="icon-toolbar">
      <span className="icon-container" onClick={handleCopy} data-tooltip="Copy">
        <i className="fas fa-copy"></i>
      </span>
      <span className="icon-container" onClick={() => handleExport("excel")} data-tooltip="Excel">
        <i className="fas fa-download"></i>
      </span>
      <span className="icon-container" onClick={() => handleExport("csv")} data-tooltip="CSV">
        <i className="fas fa-cloud-download-alt"></i>
      </span>
      <span className="icon-container" onClick={() => handleExport("pdf")} data-tooltip="PDF">
        <i className="fas fa-arrow-circle-down"></i>
      </span>
      <span className="icon-container" onClick={handlePrint} data-tooltip="Print">
        <i className="fas fa-print"></i>
      </span>
    </div>
  );
}
