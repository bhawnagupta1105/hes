  import React, { useState } from "react";
  import { jsPDF } from 'jspdf';
  import { getdownloadSATWiseHierarchy,getDownloadMetricWiseExclusionReport,getDownloadDetailedExclusionReport } from "../ApiServices/reportapi";
  import { loadConfig } from '../config';
  import autoTable from 'jspdf-autotable';
  import * as XLSX from 'xlsx';

  const tablesWithGroupedHeaders = ["Interval Data Readings SLA Details", "Daily Meter Readings SLA Details", "Billing profile data SLA Details","Division Wise SLA Summary Details"];

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(4px)"
    },
    modal: {
      width: "95%",
      maxWidth: "1400px",
      height: "90vh",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      animation: "slideIn 0.3s ease-out"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 32px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderRadius: "16px 16px 0 0"
    },
    logo: {
      maxHeight: "40px",
      maxWidth: "120px",
      width: "auto",
      height: "auto",
      marginRight: "16px",
      objectFit: "contain"
    },
    headerLeft: {
      display: "flex",
      alignItems: "center"
    },
    title: {
      fontSize: "24px",
      fontWeight: 600,
      margin: 0
    },
    closeBtn: {
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      color: "white",
      padding: "12px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: 500,
      transition: "all 0.2s ease",
      backdropFilter: "blur(10px)"
    },
    downloadBtns: {
      display: "flex",
      gap: "12px",
      alignItems: "center"
    },
    downloadBtn: {
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 500,
      transition: "all 0.2s ease",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },
    content: {
      flex: 1,
      overflowY: "auto",
      padding: "32px",
      background: "#f8fafc"
    },
    tableContainer: {
      marginBottom: "32px",
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      pageBreakInside: "avoid",
      breakInside: "avoid"
    },
    tableHeader: {
      padding: "20px 24px",
      background: "linear-gradient(135deg, #aee5f3ff 0%, #bca4f3ff 100%)",
      fontWeight: 700,
      borderBottom: "2px solid #e2e8f0"
    },
    tableTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#1e293b",
      margin: 0
    },
    tableWrapper: {
      overflowX: "auto",
      maxHeight: "400px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
      
      
    },
    th: {
      padding: "16px 12px",
      border: "1px solid #e2e8f0",
      textAlign: "center",
      fontWeight: 700,
      color: "#475569",
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      position: "sticky",
      top: 0,
      zIndex: 10,
      background: "linear-gradient(135deg, #c8e8f0ff 0%, #a6d3da 100%)"
    },
    thGrouped: {
      backgroundColor: "#e2e8f0",
      fontWeight: 700,
      color: "#334155"
    },
    thSub: {
      backgroundColor: "#f1f5f9",
      fontWeight: 500,
      top: "40px",
      zIndex: 11
    },
    td: {
      padding: "12px",
      border: "1px solid #e2e8f0",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#475569"
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      marginTop: "16px",
      padding: "16px"
    },
    pageBtn: {
      padding: "8px 12px",
      border: "1px solid #e2e8f0",
      backgroundColor: "white",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.2s ease"
    },
    activePage: {
      backgroundColor: "#3b82f6",
      color: "white",
      borderColor: "#3b82f6"
    }
  };

  export default function ReportWithPopup({
    satData,
    loadSLAData,
    dailySLAData,
    invoiceSummary,
    billsSLAData,
    exclusionSLAData,
    slaSummaryData,
    onClose,
    divisionWiseSLASummaryDetails,
    downloadSATWiseHierarchy
  }) {
    const [utility, setUtility] = useState('');
    
    React.useEffect(() => {
      debugger
      const loadUtilityConfig = async () => {
        try {
          const config = await loadConfig();
          console.log('Config:', config);
          
          setUtility(config.Utility || 'Invoice Tracker System');
        } catch (error) {
          console.warn('Could not load config:', error);
          setUtility('Invoice Tracker System');
        }
      };
      loadUtilityConfig();
    }, []);

    const generateFileName = () => {
      const invoiceNumber = invoiceSummary?.invoice_number || 'report';
      const billingDate = invoiceSummary?.billing_period || new Date().toISOString().split('T')[0];
      return `${invoiceNumber}_${billingDate}`;
    };
    const getAllTablesData = () => {
      const tables = [];
      if (satData?.columns && satData?.rows?.length) tables.push({ title: "SAT Bifurcation", columns: satData.columns, rows: satData.rows });
      if (slaSummaryData?.columns && slaSummaryData?.rows?.length) tables.push({ title: "SLA Summary", columns: slaSummaryData.columns, rows: slaSummaryData.rows });
      if (divisionWiseSLASummaryDetails?.columns && divisionWiseSLASummaryDetails?.rows?.length) tables.push({ title: "Division Wise SLA Summary Details", columns: divisionWiseSLASummaryDetails.columns, rows: divisionWiseSLASummaryDetails.rows });
      if (exclusionSLAData?.columns && exclusionSLAData?.rows?.length) tables.push({ title: "Exclusion Details", columns: exclusionSLAData.columns, rows: exclusionSLAData.rows });
      if (dailySLAData?.columns && dailySLAData?.rows?.length) tables.push({ title: "Daily Meter Readings SLA Details", columns: dailySLAData.columns, rows: dailySLAData.rows });
      if (loadSLAData?.columns && loadSLAData?.rows?.length) tables.push({ title: "Interval Data Readings SLA Details", columns: loadSLAData.columns, rows: loadSLAData.rows });
      if (billsSLAData?.columns && billsSLAData?.rows?.length) tables.push({ title: "Billing Profile Data SLA Details", columns: billsSLAData.columns, rows: billsSLAData.rows });
      if (exclusionDetails) tables.push({ title: "Annexure", exclusionData: exclusionDetails });
      return tables;
    };

    const downloadPDF = async () => {
      const doc = new jsPDF('l', 'mm', 'a4');
      const fileName = generateFileName();
      const tables = getAllTablesData();
      
      // Use the utility state that's already loaded
      const utilityName = utility || 'Invoice Tracker System';
      
      // Header styling
      doc.setFillColor(103, 126, 234);
      doc.rect(0, 0, 297, 35, 'F');
      
      // Add logo to PDF with responsive sizing
      try {
        const img = new Image();
        img.src = '/logo.png';
        img.onload = () => {
          const maxWidth = 30;
          const maxHeight = 25;
          const aspectRatio = img.width / img.height;
          let width = maxWidth;
          let height = width / aspectRatio;
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
          doc.addImage('/logo.png', 'PNG', 10, 5, width, height);
        };
        // Fallback for immediate execution
        doc.addImage('/logo.png', 'PNG', 10, 5, 25, 25);
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`Invoice Report: ${invoiceSummary?.invoice_number || 'N/A'}`, 40, 18);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Period: ${invoiceSummary?.billing_period || 'N/A'} | Total Meters: ${invoiceSummary?.total_meter || 'N/A'}`, 40, 28);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 220, 28);
      
      doc.setTextColor(0, 0, 0);
      let yPosition = 50;
      
      tables.forEach((table, index) => {
        const pageHeight = 210;
        const bottomThreshold = pageHeight * 0.6;
        
        if (yPosition > bottomThreshold) {
          doc.addPage();
          yPosition = 25;
        }
        
        // Table title with background
        doc.setFillColor(240, 248, 255);
        doc.rect(14, yPosition - 5, 269, 12, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(`${index + 1}. ${table.title}`, 18, yPosition + 3);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPosition += 15;
        
        // Handle Annexure section
        if (table.title === "Annexure" && table.exclusionData) {
          doc.setFontSize(12);
          doc.text(table.exclusionData.title, 18, yPosition);
          yPosition += 10;
          
          const splitIntro = doc.splitTextToSize(table.exclusionData.introduction, 250);
          doc.text(splitIntro, 18, yPosition);
          yPosition += splitIntro.length * 5 + 10;
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text('Exclusion Categories:', 18, yPosition);
          yPosition += 8;
          doc.setFont('helvetica', 'normal');
          
          table.exclusionData.exclusions?.forEach((exclusion, idx) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${idx + 1}. ${exclusion.category}`, 18, yPosition);
            yPosition += 6;
            doc.setFont('helvetica', 'normal');
            
            const splitDef = doc.splitTextToSize(exclusion.definition, 250);
            doc.text(splitDef, 22, yPosition);
            yPosition += splitDef.length * 4 + 4;
            
            if (exclusion.example) {
              const splitEx = doc.splitTextToSize(`Example: ${exclusion.example}`, 240);
              doc.text(splitEx, 26, yPosition);
              yPosition += splitEx.length * 4 + 4;
            }
            
            if (exclusion.note) {
              const splitNote = doc.splitTextToSize(`Note: ${exclusion.note}`, 240);
              doc.text(splitNote, 26, yPosition);
              yPosition += splitNote.length * 4 + 6;
            }
            
            if (yPosition > 180) {
              doc.addPage();
              yPosition = 25;
            }
          });
          
          doc.setFont('helvetica', 'bold');
          doc.text('Deviation Thresholds:', 18, yPosition);
          yPosition += 10;
          
          const thresholdHeaders = ['SLA Metric', 'No Supply', 'Inconsistent Supply'];
          const thresholdData = table.exclusionData.deviation_thresholds?.map(t => [
            t.sla_metric, t.no_supply, t.inconsistent_supply
          ]) || [];
          
          autoTable(doc, {
            head: [thresholdHeaders],
            body: thresholdData,
            startY: yPosition,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [103, 126, 234], textColor: [255, 255, 255] },
            margin: { left: 14, right: 14 }
          });
          
          yPosition = doc.lastAutoTable.finalY + 20;
        } else {
        
        const grouped = tablesWithGroupedHeaders.includes(table.title);
        
        if (grouped) {
          const groupedResult = getGroupedHeadersByHours(table.columns);
          const { mainColumns, hourGroups, groupedHours } = groupedResult;
          const hasHourGroups = groupedHours.length > 0;
          
          if (hasHourGroups) {
            const groupHeaders = [...mainColumns.map(col => col.headerName || col.field)];
            groupedHours.forEach(hour => {
              if (hourGroups[hour].length > 0) {
                groupHeaders.push(hour);
                for (let i = 1; i < hourGroups[hour].length; i++) {
                  groupHeaders.push('');
                }
              }
            });
            
            const subHeaders = [...mainColumns.map(() => '')];
            groupedHours.forEach(hour => {
              hourGroups[hour].forEach(col => {
                subHeaders.push(col.headerName || col.field);
              });
            });
            
            const allColumns = [...mainColumns, ...groupedHours.flatMap(h => hourGroups[h])];
            const data = table.rows.map(row => allColumns.map(col => row[col.field] || ''));
            
            autoTable(doc, {
              head: [groupHeaders, subHeaders],
              body: data,
              startY: yPosition,
              styles: { 
                fontSize: 7,
                cellPadding: 2,
                lineColor: [200, 200, 200],
                lineWidth: 0.5,
                textColor: [60, 60, 60]
              },
              headStyles: { 
                fillColor: [103, 126, 234],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold',
                halign: 'center'
              },
              alternateRowStyles: {
                fillColor: [248, 250, 252]
              },
              margin: { left: 14, right: 14 },
              showHead: 'everyPage',
              theme: 'striped'
            });
          } else {
            const headers = table.columns.map(col => col.headerName || col.field);
            const data = table.rows.map(row => table.columns.map(col => row[col.field] || ''));
            
            autoTable(doc, {
              head: [headers],
              body: data,
              startY: yPosition,
              styles: { 
                fontSize: 8,
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.5,
                textColor: [60, 60, 60]
              },
              headStyles: { 
                fillColor: [103, 126, 234],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center'
              },
              alternateRowStyles: {
                fillColor: [248, 250, 252]
              },
              margin: { left: 14, right: 14 },
              showHead: 'everyPage',
              theme: 'striped'
            });
          }
        } else {
          const headers = table.columns.map(col => col.headerName || col.field);
          const data = table.rows.map(row => table.columns.map(col => row[col.field] || ''));
          
          autoTable(doc, {
            head: [headers],
            body: data,
            startY: yPosition,
            styles: { 
              fontSize: 8,
              cellPadding: 3,
              lineColor: [200, 200, 200],
              lineWidth: 0.5,
              textColor: [60, 60, 60]
            },
            headStyles: { 
              fillColor: [103, 126, 234],
              textColor: [255, 255, 255],
              fontSize: 9,
              fontStyle: 'bold',
              halign: 'center'
            },
            alternateRowStyles: {
              fillColor: [248, 250, 252]
            },
            margin: { left: 14, right: 14 },
            showHead: 'everyPage',
            theme: 'striped'
          });
        }
        
        yPosition = doc.lastAutoTable.finalY + 20;
        }
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      const billingDate = invoiceSummary?.billing_period || new Date().toLocaleDateString();
      
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        
        // Left: Utility name from config
        doc.text(utilityName, 14, 205);
        
        // Center: Page number
        const pageText = `Page ${i} of ${pageCount}`;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(pageText);
        doc.text(pageText, (pageWidth - textWidth) / 2, 205);
        
        // Right: Billing period
        const billingText = `Billing Period: ${billingDate}`;
        const billingWidth = doc.getTextWidth(billingText);
        doc.text(billingText, pageWidth - billingWidth - 14, 205);
      }
      
      doc.save(`${fileName}.pdf`);
    };

    const downloadExcel = () => {
      const fileName = generateFileName();
      const tables = getAllTablesData();
      const wb = XLSX.utils.book_new();
      
      tables.forEach((table, index) => {
        const grouped = tablesWithGroupedHeaders.includes(table.title);
        let wsData;
        
        if (grouped) {
          const groupedResult = getGroupedHeadersByHours(table.columns);
          const { mainColumns, hourGroups, groupedHours } = groupedResult;
          const hasHourGroups = groupedHours.length > 0;
          
          if (hasHourGroups) {
            const groupHeaders = [...mainColumns.map(col => col.headerName || col.field)];
            groupedHours.forEach(hour => {
              if (hourGroups[hour].length > 0) {
                groupHeaders.push(hour);
                for (let i = 1; i < hourGroups[hour].length; i++) {
                  groupHeaders.push('');
                }
              }
            });
            
            const subHeaders = [...mainColumns.map(() => '')];
            groupedHours.forEach(hour => {
              hourGroups[hour].forEach(col => {
                subHeaders.push(col.headerName || col.field);
              });
            });
            
            const allColumns = [...mainColumns, ...groupedHours.flatMap(h => hourGroups[h])];
            const data = table.rows.map(row => allColumns.map(col => row[col.field] || ''));
            
            wsData = [groupHeaders, subHeaders, ...data];
          } else {
            const headers = table.columns.map(col => col.headerName || col.field);
            const data = table.rows.map(row => table.columns.map(col => row[col.field] || ''));
            wsData = [headers, ...data];
          }
        } else {
          const headers = table.columns.map(col => col.headerName || col.field);
          const data = table.rows.map(row => table.columns.map(col => row[col.field] || ''));
          wsData = [headers, ...data];
        }
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Style headers
        const range = XLSX.utils.decode_range(ws['!ref']);
        const merges = [];
        
        if (grouped) {
          const groupedResult = getGroupedHeadersByHours(table.columns);
          const { mainColumns, hourGroups, groupedHours } = groupedResult;
          const hasHourGroups = groupedHours.length > 0;
          
          if (hasHourGroups) {
            // Style both header rows
            for (let row = 0; row <= 1; row++) {
              for (let col = range.s.c; col <= range.e.c; col++) {
                const headerCell = XLSX.utils.encode_cell({ r: row, c: col });
                if (ws[headerCell]) {
                  ws[headerCell].s = {
                    fill: { fgColor: { rgb: row === 0 ? "677EEA" : "E0F2FE" } },
                    font: { color: { rgb: row === 0 ? "FFFFFF" : "000000" }, bold: true },
                    alignment: { horizontal: "center", vertical: "center" }
                  };
                }
              }
            }
            
            // Create merges for grouped headers
            let colIndex = mainColumns.length;
            groupedHours.forEach(hour => {
              if (hourGroups[hour].length > 1) {
                merges.push({
                  s: { r: 0, c: colIndex },
                  e: { r: 0, c: colIndex + hourGroups[hour].length - 1 }
                });
              }
              colIndex += hourGroups[hour].length;
            });
            
            ws['!merges'] = merges;
          } else {
            for (let col = range.s.c; col <= range.e.c; col++) {
              const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
              if (ws[headerCell]) {
                ws[headerCell].s = {
                  fill: { fgColor: { rgb: "677EEA" } },
                  font: { color: { rgb: "FFFFFF" }, bold: true },
                  alignment: { horizontal: "center", vertical: "center" }
                };
              }
            }
          }
        } else {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
            if (ws[headerCell]) {
              ws[headerCell].s = {
                fill: { fgColor: { rgb: "677EEA" } },
                font: { color: { rgb: "FFFFFF" }, bold: true },
                alignment: { horizontal: "center", vertical: "center" }
              };
            }
          }
        }
        
        // Auto-fit columns
        const colWidths = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
          let maxWidth = 10;
          for (let row = range.s.r; row <= range.e.r; row++) {
            const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
            if (cell && cell.v) {
              maxWidth = Math.max(maxWidth, cell.v.toString().length + 2);
            }
          }
          colWidths.push({ wch: Math.min(maxWidth, 30) });
        }
        ws['!cols'] = colWidths;
        
        const sheetName = table.title.replace(/[\[\]\*\?\/\\]/g, '').substring(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });
      
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    const fetchsatdata = async (satName) => {
      debugger
          const cellKey = `quantity_${satName}`;
          setDownloadingCells(prev => new Set([...prev, cellKey]));
          try {
            const response = await getdownloadSATWiseHierarchy(satName);
            const columns = response.columns || Object.keys(response.rows?.[0] || {}).map((f) => ({ field: f }));
            const rows = response.rows || [];
    
            const convertToCSV = (columns, rows) => {
              const header = columns.map(col => col.field).join(",");
              const data = rows.map(row =>
                columns.map(col => `"${(row[col.field] ?? "").toString().replace(/"/g, '""')}"`).join(",")
              );
              return [header, ...data].join("\n");
            };
    
            const csvContent = convertToCSV(columns, rows);
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `${satName}_hierarchy.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (err) {
            console.error("Failed to fetch SAT data for category:", satName, err);
          } finally {
            setDownloadingCells(prev => {
              const newSet = new Set(prev);
              newSet.delete(cellKey);
              return newSet;
            });
          }
        };
        const fetchMetricWiseExclusionReport = async (invoiceNumber,metric) => {
      debugger
          const cellKey = `exclusion_${metric}`;
          setDownloadingCells(prev => new Set([...prev, cellKey]));
          try {
            const response = await getDownloadMetricWiseExclusionReport(invoiceNumber,metric);
            const columns = response.columns || Object.keys(response.rows?.[0] || {}).map((f) => ({ field: f }));
            const rows = response.rows || [];
    
            const convertToCSV = (columns, rows) => {
              const header = columns.map(col => col.field).join(",");
              const data = rows.map(row =>
                columns.map(col => `"${(row[col.field] ?? "").toString().replace(/"/g, '""')}"`).join(",")
              );
              return [header, ...data].join("\n");
            };
    
            const csvContent = convertToCSV(columns, rows);
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `${invoiceNumber}_${metric}_data.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (err) {
            console.error("Failed to fetch MetricWiseExclusionReport data for category:", invoiceNumber, err);
          } finally {
            setDownloadingCells(prev => {
              const newSet = new Set(prev);
              newSet.delete(cellKey);
              return newSet;
            });
          }
        };
        const fetchdetailedMetricWiseExclusionReport = async (invoiceNumber,satName,exclusion) => {
          debugger
          const cellKey = `detailed_${satName}_${exclusion}`;
          setDownloadingCells(prev => new Set([...prev, cellKey]));
          try {
            const response = await getDownloadDetailedExclusionReport(invoiceNumber,satName,exclusion);
            const columns = response.columns || Object.keys(response.rows?.[0] || {}).map((f) => ({ field: f }));
            const rows = response.rows || [];
    
            const convertToCSV = (columns, rows) => {
              const header = columns.map(col => col.field).join(",");
              const data = rows.map(row =>
                columns.map(col => `"${(row[col.field] ?? "").toString().replace(/"/g, '""')}"`).join(",")
              );
              return [header, ...data].join("\n");
            };
    
            const csvContent = convertToCSV(columns, rows);
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", `${invoiceNumber}_${satName}_${exclusion}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (err) {
            console.error("Failed to fetch DetailedExclusionReport:", err);
          } finally {
            setDownloadingCells(prev => {
              const newSet = new Set(prev);
              newSet.delete(cellKey);
              return newSet;
            });
          }
        };
    const [currentPages, setCurrentPages] = useState({});
    const [hoveredCell, setHoveredCell] = useState(null);
    const [downloadingCells, setDownloadingCells] = useState(new Set());
    const [exclusionDetails, setExclusionDetails] = useState(null);
    const itemsPerPage = 10;
      const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchExclusionDetails = async () => {
        try {
          const response = await fetch('/exclusion_details.json?t=' + Date.now());
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Fetched exclusion details:', data);
          console.log('Exclusions array:', data.exclusions);
          setExclusionDetails(data);
        } catch (error) {
          console.error('Error fetching exclusion details:', error);
        }
      };
      fetchExclusionDetails();
    }, []);

  const handleCellClick = (row, col, tableTitle) => {
    console.log('Cell clicked:', { field: col.field, tableTitle, row });
    
    if (col.field === "Quantity") {
      const satNumber = row["SAT Number"];
      const cellKey = `quantity_${satNumber}`;
      if (downloadingCells.has(cellKey)) return;
      console.log('Quantity clicked, satNumber:', satNumber);
      if (satNumber) {
        fetchsatdata(satNumber);
      }
    }
    if(tableTitle === "SLA Summary" && col.field === "Exclusion Count"){
      const metric = row["Metric"];
      const cellKey = `exclusion_${metric}`;
      if (downloadingCells.has(cellKey)) return;
      const invoiceNumber = invoiceSummary?.invoice_number;
      console.log('Exclusion Count clicked:', { metric, invoiceNumber });
      if(metric && invoiceNumber){
        fetchMetricWiseExclusionReport(invoiceNumber, metric);
      }
    }
    if(tableTitle === "Exclusion Details" && col.field !== "Total" && col.field !== "SAT Name"){
      const satName = row["SAT Name"];
      const exclusion = col.field;
      const cellKey = `detailed_${satName}_${exclusion}`;
      if (downloadingCells.has(cellKey)) return;
      const invoiceNumber = invoiceSummary?.invoice_number;
      console.log('Exclusion Details clicked:', { satName, exclusion, invoiceNumber, tableTitle });
      if(satName && exclusion && invoiceNumber){
        fetchdetailedMetricWiseExclusionReport(invoiceNumber, satName, exclusion);
      }
    }
  };



    const handleCellHover = (rowIndex, colField, isEntering) => {
      setHoveredCell(isEntering ? { rowIndex, colField } : null);
    };

    // ✅ Normal helper function for pagination
    const paginateRows = (rows, page) => {
      const startIndex = page * itemsPerPage;
      return rows.slice(startIndex, startIndex + itemsPerPage);
    };

    const setCurrentPage = (tableTitle, page) => {
      setCurrentPages(prev => ({ ...prev, [tableTitle]: page }));
    };

    const getCurrentPage = (tableTitle) => currentPages[tableTitle] || 0;

    const getGroupedHeadersByHours = (columns) => {
      const mainColumns = [];
      const hourGroups = { "8 Hrs": [], "12 Hrs": [], "72 Hrs": [], "168 Hrs": [] };

      columns.forEach(col => {
        const field = col.field;
        if (field.match(/8HRS$/)) hourGroups["8 HRS"].push(col);
        else if (field.match(/12HRS$/)) hourGroups["12 HRS"].push(col);
        else if (field.match(/72HRS/)) hourGroups["72 HRS"].push(col);
        else if (field.match(/168HRS/)) hourGroups["168 Hrs"].push(col);
        else mainColumns.push(col);
      });

      const groupedHours = Object.keys(hourGroups).filter(hour => hourGroups[hour].length > 0);
      return { mainColumns, hourGroups, groupedHours };
    };

    const renderPagination = (totalRows, currentPage, tableTitle) => {
      const totalPages = Math.ceil(totalRows / itemsPerPage);
      if (totalPages <= 1) return null;

      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      return (
        <div style={styles.pagination}>
          <button 
            style={{ ...styles.pageBtn, opacity: currentPage === 0 ? 0.5 : 1 }}
            onClick={() => setCurrentPage(tableTitle, 0)}
            disabled={currentPage === 0}
          >««</button>
          <button 
            style={{ ...styles.pageBtn, opacity: currentPage === 0 ? 0.5 : 1 }}
            onClick={() => setCurrentPage(tableTitle, currentPage - 1)}
            disabled={currentPage === 0}
          >‹</button>
          {pages.map(page => (
            <button
              key={page}
              style={{ ...styles.pageBtn, ...(page === currentPage ? styles.activePage : {}) }}
              onClick={() => setCurrentPage(tableTitle, page)}
            >
              {page + 1}
            </button>
          ))}
          <button 
            style={{ ...styles.pageBtn, opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}
            onClick={() => setCurrentPage(tableTitle, currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >›</button>
          <button 
            style={{ ...styles.pageBtn, opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}
            onClick={() => setCurrentPage(tableTitle, totalPages - 1)}
            disabled={currentPage === totalPages - 1}
          >»»</button>
          <span style={{ marginLeft: '16px', color: '#64748b', fontSize: '14px' }}>
            Page {currentPage + 1} of {totalPages} ({totalRows} items)
          </span>
        </div>
      );
    };

    const renderGroupedTable = (columns, rows, title) => {
      if (!columns?.length) return null;
      
      const hasData = rows?.length > 0;

      const grouped = tablesWithGroupedHeaders.includes(title);
      let mainColumns = columns;
      let hourGroups = { "8 Hrs": [], "12 Hrs": [], "72 Hrs": [], "168 Hrs": [] };
      let groupedHours = [];
      let hasHourGroups = false;

      if (grouped) {
        const groupedResult = getGroupedHeadersByHours(columns);
        mainColumns = groupedResult.mainColumns;
        hourGroups = groupedResult.hourGroups;
        groupedHours = groupedResult.groupedHours;
        hasHourGroups = groupedHours.length > 0;
      }

      const currentPage = getCurrentPage(title);
      const paginatedRows = paginateRows(rows, currentPage);

      return (
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>{title}</h3>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                {hasHourGroups ? (
                  <>
                    <tr>
                      {mainColumns.map(col => (
                        <th key={col.field} rowSpan={2} style={{ ...styles.th, ...styles.thGrouped }}>{col.headerName || col.field}</th>
                      ))}
                      {groupedHours.map(hour =>
                        hourGroups[hour].length > 0 ? (
                          <th key={hour} colSpan={hourGroups[hour].length} style={{ ...styles.th, ...styles.thGrouped }}>{hour}</th>
                        ) : null
                      )}
                    </tr>
                    <tr>
                      {groupedHours.map(hour =>
                        hourGroups[hour].map(col => (
                          <th key={col.field} style={{ ...styles.th, ...styles.thSub }}>{col.headerName || col.field}</th>
                        ))
                      )}
                    </tr>
                  </>
                ) : (
                  <tr>
                    {columns.map(col => <th key={col.field} style={styles.th}>{col.headerName || col.field}</th>)}
                  </tr>
                )}
              </thead>

              <tbody>
                {hasData ? paginatedRows.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? "#f8fafc" : "#ffffff", transition: "background-color 0.2s ease" }}>
                    {(hasHourGroups ? [...mainColumns, ...groupedHours.flatMap(h => hourGroups[h])] : columns).map(col => {
                      const isHovered = hoveredCell?.rowIndex === rowIndex && hoveredCell?.colField === col.field;
                      const isTotalRow = Object.values(row).some(value => 
                        typeof value === 'string' && value.toLowerCase().includes('total')
                      );
                      const isClickable = !isTotalRow && (col.field === "Quantity" || (title === "SLA Summary" && col.field === "Exclusion Count") || (title === "Exclusion Details" && col.field !== "Total" && col.field !== "SAT Name"));
                      
                      let cellKey = '';
                      if (col.field === "Quantity") cellKey = `quantity_${row["SAT Number"]}`;
                      else if (title === "SLA Summary" && col.field === "Exclusion Count") cellKey = `exclusion_${row["Metric"]}`;
                      else if (title === "Exclusion Details" && col.field !== "Total" && col.field !== "SAT Name") cellKey = `detailed_${row["SAT Name"]}_${col.field}`;
                      
                      const isDownloading = downloadingCells.has(cellKey);
                      
                      return (
                      <td
    key={col.field}
    style={{
      ...styles.td,
      backgroundColor: isHovered ? '#e0f2fe' : 'transparent',
      fontWeight: isHovered ? 500 : 'normal',
      color: isClickable ? "#1976d2" : "#475569",
      textDecoration: isClickable ? "underline" : "none",
      cursor: isClickable ? (isDownloading ? "wait" : "pointer") : "default",
      opacity: isDownloading ? 0.6 : 1
    }}
    onClick={() => handleCellClick(row, col, title)}
    onMouseEnter={() => handleCellHover(rowIndex, col.field, true)}
    onMouseLeave={() => handleCellHover(rowIndex, col.field, false)}
  >
    {isDownloading ? '⏳ Downloading...' : row[col.field]}
  </td>

                      );
                    })}
                  </tr>
                )) : (
                  <tr>
                    <td 
                      colSpan={(hasHourGroups ? [...mainColumns, ...groupedHours.flatMap(h => hourGroups[h])] : columns).length}
                      style={{ ...styles.td, fontStyle: 'italic', color: '#64748b', padding: '24px' }}
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {hasData && renderPagination(rows.length, currentPage, title)}
        </div>
      );
    };

    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <img src="/logo.png" alt="Logo" style={styles.logo} />
              <h2 style={styles.title}>
                📊 Invoice Report: {invoiceSummary?.invoice_number || "N/A"}
                {invoiceSummary?.billing_period && (
                  <div style={{ fontSize: 14, fontWeight: 400, marginTop: 4, opacity: 0.9 }}>
                    Period: {invoiceSummary.billing_period} | Meters: {invoiceSummary.total_meter || 'N/A'}
                  </div>
                )}
              </h2>
            </div>
            <div style={styles.downloadBtns}>
              <button style={styles.downloadBtn} onClick={downloadPDF}>
                📄 PDF
              </button>
              <button style={styles.downloadBtn} onClick={downloadExcel}>
                🟩 Excel
              </button>
              <button style={styles.closeBtn} onClick={onClose}>✕ Close</button>
            </div>
          </div>
          <div style={styles.content}>
            {satData && renderGroupedTable(satData.columns, satData.rows, "SAT Bifurcation")}
            {slaSummaryData && renderGroupedTable(slaSummaryData.columns, slaSummaryData.rows, "SLA Summary")}
            {divisionWiseSLASummaryDetails && renderGroupedTable(divisionWiseSLASummaryDetails.columns, divisionWiseSLASummaryDetails.rows, "Division Wise SLA Summary Details")}
            {exclusionSLAData && renderGroupedTable(exclusionSLAData.columns, exclusionSLAData.rows, "Exclusion Details")}
            {dailySLAData && renderGroupedTable(dailySLAData.columns, dailySLAData.rows, "Daily Meter Readings SLA Details")}
            {loadSLAData && renderGroupedTable(loadSLAData.columns, loadSLAData.rows, "Interval Data Readings SLA Details")}
            {billsSLAData && renderGroupedTable(billsSLAData.columns, billsSLAData.rows, "Billing Profile Data SLA Details")}
            
            <div style={{ pageBreakBefore: 'always', marginTop: '80px' }}>
              <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                  <h3 style={styles.tableTitle}>Annexure</h3>
                </div>
                <div style={{ padding: '24px', lineHeight: '1.6', fontSize: '14px' }}>
                  {exclusionDetails ? (
                    <>
                      <h4 style={{ color: '#1e293b', marginBottom: '16px' }}>{exclusionDetails.title}</h4>
                      <p style={{ color: '#475569', marginBottom: '24px' }}>{exclusionDetails.introduction}</p>
                      
                      <h5 style={{ color: '#1e293b', marginBottom: '16px' }}>Exclusion Categories:</h5>
                      {exclusionDetails.exclusions && exclusionDetails.exclusions.length > 0 ? exclusionDetails.exclusions.map((exclusion, index) => (
                        <div key={index} style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                          <strong style={{ color: '#1e293b' }}>{index + 1}. {exclusion.category}</strong>
                          <p style={{ marginTop: '8px', color: '#475569' }}>{exclusion.definition}</p>
                          {exclusion.example && (
                            <p style={{ marginTop: '8px', fontStyle: 'italic', color: '#64748b' }}>
                              <strong>Example:</strong> {exclusion.example}
                            </p>
                          )}
                          {exclusion.examples && (
                            <div style={{ marginTop: '8px' }}>
                              <strong style={{ color: '#64748b' }}>Examples:</strong>
                              <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                                {exclusion.examples?.map((ex, i) => (
                                  <li key={i} style={{ color: '#64748b', fontStyle: 'italic' }}>{ex}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {exclusion.formula && (
                            <p style={{ marginTop: '8px', fontFamily: 'monospace', backgroundColor: '#e2e8f0', padding: '8px', borderRadius: '4px' }}>
                              <strong>Formula:</strong> {exclusion.formula}
                            </p>
                          )}
                          {exclusion.note && (
                            <p style={{ marginTop: '8px', color: '#059669', fontSize: '13px' }}>
                              <strong>Note:</strong> {exclusion.note}
                            </p>
                          )}
                        </div>
                      )) : <p style={{ color: '#dc2626' }}>No exclusions data found</p>}
                      
                      <h5 style={{ color: '#1e293b', marginTop: '32px', marginBottom: '16px' }}>Deviation Thresholds:</h5>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#e2e8f0' }}>
                              <th style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'left' }}>SLA Metric</th>
                              <th style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'left' }}>No Supply</th>
                              <th style={{ padding: '12px', border: '1px solid #cbd5e1', textAlign: 'left' }}>Inconsistent Supply</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exclusionDetails.deviation_thresholds?.map((threshold, index) => (
                              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{threshold.sla_metric}</td>
                                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{threshold.no_supply}</td>
                                <td style={{ padding: '12px', border: '1px solid #cbd5e1' }}>{threshold.inconsistent_supply}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <p>Loading exclusion details...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }