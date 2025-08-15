import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import './VisitorToolbar.css';

export default function VisitorToolbar({ visitors, columns }) {
  const headers = columns.map(col => col.label); // display names

  const handleCopy = () => {
    if (!visitors.length) return alert("No data to copy");

    const tsvContent = [
      headers.join("\t"),
      ...visitors.map(v =>
        columns.map(col => v[col.key] ?? "N/A").join("\t")
      ),
    ].join("\n");

    navigator.clipboard
      .writeText(tsvContent)
      .then(() => alert("Data copied to clipboard!"))
      .catch(err => {
        console.error("Failed to copy:", err);
        alert("Failed to copy data.");
      });
  };

  const handleExport = (type) => {
    if (!visitors.length) return alert("No data to export");

    // Prepare filtered data
    const exportData = visitors.map(v => {
      const obj = {};
      columns.forEach(col => obj[col.label] = v[col.key] ?? "N/A");
      return obj;
    });

    if (type === "excel" || type === "csv") {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");
      XLSX.writeFile(workbook, `VisitorData.${type === "csv" ? "csv" : "xlsx"}`);
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("Visitor Data", 14, 15);
      autoTable(doc, {
        head: [headers],
        body: visitors.map(v => columns.map(col => v[col.key] ?? "N/A")),
        startY: 20,
        styles: { fontSize: 8 },
      });
      doc.save("VisitorData.pdf");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="icon-toolbar">
      <span className="icon-container" onClick={handleCopy} title="Copy">
        <i className="fas fa-copy"></i>
      </span>
      <span className="icon-container" onClick={() => handleExport("excel")}>
        <i className="fas fa-file-excel"></i>
      </span>
      <span className="icon-container" onClick={() => handleExport("csv")}>
        <i className="fas fa-file-csv"></i>
      </span>
      <span className="icon-container" onClick={() => handleExport("pdf")}>
        <i className="fas fa-file-pdf"></i>
      </span>
      <span className="icon-container" onClick={handlePrint}>
        <i className="fas fa-print"></i>
      </span>
    </div>
  );
}
