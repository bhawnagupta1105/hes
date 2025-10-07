import React, { useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import ReportWithPopup from "./Report";

export default function ReportWithPreview({
    satData,
    loadSLAData,
    dailySLAData,
    invoiceSummary,
    onClose,
    billsSLAData,
    exclusionSLAData,
    slaSummaryData,
    downloadSATWiseHierarchy
}) {
    const { invoice_number, total_meter, billing_period } = invoiceSummary || {};
    const [downloadingSat, setDownloadingSat] = useState(null);

    // const handleDownloadSat = async (satName) => {
    //     if (!satName) return;
    //     setDownloadingSat(satName);
    //     try {
    //         const response = await downloadSATWiseHierarchy(satName);
    //         const columns = response.columns.map(col => col.headerName || col.field);
    //         const rows = response.rows;
    //         const csvContent = convertToCSV(columns, rows);
    //         triggerDownload(csvContent, `${invoice_number || "Invoice"}-${satName.replace(/\s+/g, "_")}_details.csv`);
    //     } catch (error) {
    //         console.error("Error downloading SAT details:", error);
    //         alert("Failed to download SAT details. Please try again.");
    //     } finally {
    //         setDownloadingSat(null);
    //     }
    // };

    // const convertToCSV = (columns, rows) => {
    //     const header = columns.join(",") + "\n";
    //     const body = rows.map(row => {
    //         return columns.map(col => {
    //             const value = row[col] !== undefined ? row[col] : "";
    //             return `"${String(value).replace(/"/g, '""')}"`;
    //         }).join(",");
    //     }).join("\n");
    //     return header + body;
    // };

    // const triggerDownload = (content, filename) => {
    //     const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = filename;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <div style={{
                width: "80%",
                height: "90%",
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: "#4f46e5",
                    color: "#fff"
                }}>
                    {/* <h3>Report Preview</h3> */}
                    <button
                        onClick={onClose}
                        style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
                    >
                        ✖ Close
                    </button>
                </div>

                {/* SAT Names Download List */}
                {/* <div style={{ padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
                    <h4>SAT Names</h4>
                    {satData.rows.map((row, index) => (
                        <div key={index} style={{ marginBottom: "6px" }}>
                            <button
                                style={{
                                    padding: "6px 12px",
                                    background: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                                disabled={downloadingSat === row.sat_name}
                                onClick={() => handleDownloadSat(row.sat_name)}
                            >
                                {downloadingSat === row.sat_name ? "Downloading..." : `Download ${row.sat_name}`}
                            </button>
                        </div>
                    ))}
                </div> */}

                {/* PDF Viewer */}
                <PDFViewer width="100%" height="100%" showToolbar>
                    <ReportWithPopup
                        satData={satData}
                        loadSLAData={loadSLAData}
                        dailySLAData={dailySLAData}
                        invoiceSummary={invoiceSummary}
                        billsSLAData={billsSLAData}
                        exclusionSLAData={exclusionSLAData}
                        slaSummaryData={slaSummaryData}
                        downloadSATWiseHierarchy={downloadSATWiseHierarchy} // Only if Report needs it
                    />
                </PDFViewer>

                {/* PDF Download Button */}
                <div style={{ textAlign: "center", margin: 10 }}>
                    <PDFDownloadLink
                        key={invoiceSummary?.invoice_number}
                        document={
                            <ReportWithPopup
                                satData={satData}
                                loadSLAData={loadSLAData}
                                dailySLAData={dailySLAData}
                                invoiceSummary={invoiceSummary}
                                billsSLAData={billsSLAData}
                                exclusionSLAData={exclusionSLAData}
                                slaSummaryData={slaSummaryData}
                            />
                        }
                        fileName={`${invoice_number || "Invoice"}-${billing_period || "Period"}.pdf`}
                    >
                        {({ loading }) => (
                            <button style={{
                                padding: "6px 12px",
                                background: "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4
                            }}>
                                {loading ? "Preparing PDF..." : "Download PDF"}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>
        </div>
    );
}
