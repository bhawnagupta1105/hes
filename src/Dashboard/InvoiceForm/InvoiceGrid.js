  import * as React from "react";
  import { DataGrid } from "@mui/x-data-grid";
  import { getCardTableData } from "../../ApiServices/api";
  import ReportWithPreview from "../ReportWithPreview";
  import ReportWithPopup from "../Report"
  import {
    getSATBifurcationDetails,
    getLoadSLADetails,
    getDailySLADetails,
    getBillSLADetails,
    getExclusionSummaryDetails,
    getSLASummaryDetails,
    getdownloadSATWiseHierarchy,
    getDivisionWiseSLASummaryDetails,
  } from "../../ApiServices/reportapi";

  // Utility function to sanitize text content
  const sanitizeText = (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(/[<>"'&]/g, (match) => {
      const escapeMap = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return escapeMap[match];
    });
  };

  const InvoiceGrid = ({ cardTitle, displayValue }) => {
    const [rows, setRows] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [rowCount, setRowCount] = React.useState(0);
    const [loading, setLoading] = React.useState(true);

    const [satData, setSatData] = React.useState([]);
    const [loadSLAData, setLoadSLAData] = React.useState([]);
    const [dailySLAData, setDailySLAData] = React.useState([]);
    const [billsSLAData, setBillsSLAData] = React.useState([]);
    const [exclusionSLAData, setExclusionSLAData] = React.useState([]);
    const [slaSummaryData, setSlaSummaryData] = React.useState([]);
    const [divisionWiseSLASummaryDetails, setDivisionWiseSLASummaryDetails] = React.useState([]);
    const [downloadSATWiseHierarchy, setDownloadSATWiseHierarchy] = React.useState([]);

    const [invoiceSummary, setInvoiceSummary] = React.useState({});
    const [isReportOpen, setIsReportOpen] = React.useState(false);

    // const [categoryPopupOpen, setCategoryPopupOpen] = React.useState(false);
    // const [categoryRows, setCategoryRows] = React.useState([]);
    // const [categoryColumns, setCategoryColumns] = React.useState([]);

    // const handleDownloadSAT = async (satName) => {
    //   try {
    //     debugger
    //     const data = await getdownloadSATWiseHierarchy(satName);
    //     const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(blob);
    //     link.setAttribute("download", `${satName}_hierarchy.csv`);
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   } catch (error) {
    //     console.error("Download failed", error);
    //   }
    // };

    // const fetchsatdata = async (satName) => {
    //   setLoading(true);
    //   try {
    //     const response = await getdownloadSATWiseHierarchy(satName);
    //     const columns = response.columns || Object.keys(response.rows?.[0] || {}).map((f) => ({ field: f }));
    //     const rows = response.rows || [];

    //     const convertToCSV = (columns, rows) => {
    //       const header = columns.map(col => col.field).join(",");
    //       const data = rows.map(row =>
    //         columns.map(col => `"${(row[col.field] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    //       );
    //       return [header, ...data].join("\n");
    //     };

    //     const csvContent = convertToCSV(columns, rows);
    //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(blob);
    //     link.setAttribute("download", `${satName}_hierarchy.csv`);
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   } catch (err) {
    //     console.error("Failed to fetch SAT data for category:", satName, err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const addIds = React.useCallback((rows) => 
      rows.map((row, index) => ({
        id: index + 1 + page * pageSize,
        ...row,
      })), [page, pageSize]);

    const downloadSatBifurcationData = React.useCallback(async (satName) => {
      try {
        setLoading(true);
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
        link.setAttribute("download", `${satName}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Failed to download SAT bifurcation data:", error);
        alert("Failed to download SAT bifurcation data. Please try again.");
      } finally {
        setLoading(false);
      }
    }, []);

//     const fetchsatdatatable = async (invoice_number) => {
//       setLoading(true);
//       try {
//         const response = await getSATBifurcationDetails(invoice_number);
//         const rowsWithId = addIds(response.rows || []);
//         setSatData({
//           columns: response.columns || Object.keys(response.rows).map((f) => ({ field: f })),
//           rows: rowsWithId,
//         });
        
//  const mappedRows = response.rows.map((row, index) => ({
//           id: index + 1 + page * pageSize,
//           ...row,
//         }));
//         setCategoryRows(mappedRows);
//         const cols = (response.columns && response.columns.length > 0
//   ? response.columns.map(col => ({
//       field: col.field,
//       headerName: col.headerName || col.field, // ensure headerName is set
//       flex: 1,
//       sortable: col.sortable ?? false,
//       filterable: col.filter ?? false,
//     }))
//   : Object.keys(response.rows?.[0] || {}).map((f) => ({
//       field: f,
//       headerName: f,
//       flex: 1,
//     }))).map((col) => {
//           if (col.field === "Quantity") {
//             return {
//               ...col,
//               renderCell: (params) => (
//                 <span
//                   style={{
//                     color: "#1976d2",
//                     cursor: "pointer",
//                     textDecoration: "underline",
//                   }}
//                   onClick={() => fetchsatdata(params.row["SAT Number"])}
//                 >
//                   {params.value}
//                 </span>
//               ),
//             };
//           }
//           return col;
//         });

//         setCategoryColumns(cols);
//       } catch (err) {
//         console.error("Failed to fetch SAT data for category:", invoice_number, err);
//       } finally {
//         setLoading(false);
//       }
//     };

    const fetchReportData = React.useCallback(async (invoiceNumber) => {
      if (!invoiceNumber) {
        console.error("Invalid invoice number provided");
        return;
      }

      try {
        setLoading(true);
        const [
          satResponse,
          loadResponse,
          dailyResponse,
          billsResponse,
          exclusionResponse,
          slaSummaryResponse,
          divisionWiseSLASummaryResponse,
        ] = await Promise.all([
          getSATBifurcationDetails(invoiceNumber),
          getLoadSLADetails(invoiceNumber),
          getDailySLADetails(invoiceNumber),
          getBillSLADetails(invoiceNumber),
          getExclusionSummaryDetails(invoiceNumber),
          getSLASummaryDetails(invoiceNumber),
          getDivisionWiseSLASummaryDetails(invoiceNumber)
        ]);

        const createDataStructure = (response) => ({
          columns: response?.columns || Object.keys(response?.rows?.[0] || {}).map((f) => ({ field: f })),
          rows: response?.rows || [],
        });

        setSatData(createDataStructure(satResponse));
        setLoadSLAData(createDataStructure(loadResponse));
        setDailySLAData(createDataStructure(dailyResponse));
        setBillsSLAData(createDataStructure(billsResponse));
        setExclusionSLAData(createDataStructure(exclusionResponse));
        setSlaSummaryData(createDataStructure(slaSummaryResponse));
        setDivisionWiseSLASummaryDetails(createDataStructure(divisionWiseSLASummaryResponse))

        setInvoiceSummary({
          invoice_number: satResponse?.invoice_number,
          total_meter: satResponse?.total_meter,
          billing_period: satResponse?.billing_period,
        });

        setIsReportOpen(true);
      } catch (error) {
        console.error("Error fetching report data:", error);
        // Show user-friendly error message
        alert("Failed to load report data. Please try again.");
      } finally {
        setLoading(false);
      }
    }, []);

    const fetchData = React.useCallback(async () => {
      try {
        setLoading(true);
        const apiData = await getCardTableData(page + 1, pageSize, cardTitle);
        
        if (!apiData?.columns || !apiData?.rows) {
          throw new Error("Invalid API response structure");
        }

        const uniqueColumns = apiData.columns.filter((col, index, self) =>
          index === self.findIndex((c) => c.field === col.field)
        );

        const mappedColumns = uniqueColumns.map((col) => {
          const isOpexClaimed = cardTitle?.toLowerCase().includes("opex claimed");
          const isSatNameClickable = isOpexClaimed && (col.field === "SAT Name" || col.field === "satName" || col.field === "sat_name");
          const isClickable = col.clickable || isSatNameClickable;
          const isCategoryColumn = col.field === "Category" || col.field === "category";
          
          return {
            field: col.field,
            headerName: col.title,
            flex: 1,
            minWidth: isCategoryColumn ? 200 : 150,
            sortable: col.sortable ?? true,
            hide: window.innerWidth < 600 && col.field !== "Invoice Number",
            clickable: isClickable,
            renderCell: (params) =>
              isClickable ? (
                <span style={{ color: "#1976d2", cursor: "pointer" }} onClick={() => handleCellClick(params)}>
                  {sanitizeText(params.value)}
                </span>
              ) : (
                <span style={{ 
                  whiteSpace: "normal", 
                  wordBreak: "break-word",
                  ...(isCategoryColumn && { 
                    display: "block",
                    lineHeight: "1.4",
                    padding: "8px 4px"
                  })
                }}>
                  {sanitizeText(params.value)}
                </span>
              ),
          };
        });

        const mappedRows = addIds(apiData.rows);

        setColumns(mappedColumns);
        setRows(mappedRows);
        setRowCount(displayValue);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }, [page, pageSize, cardTitle, displayValue, addIds]);

    React.useEffect(() => {
      fetchData();
    }, [fetchData]);

    React.useEffect(() => {
      const updatePageSize = () => {
        if (window.innerWidth < 600) setPageSize(5);
        else if (window.innerWidth < 1024) setPageSize(10);
        else setPageSize(25);
        setPage(0);
      };
      updatePageSize();
      window.addEventListener("resize", updatePageSize);
      return () => window.removeEventListener("resize", updatePageSize);
    }, []);

    const handleCellClick = React.useCallback(async (params) => {
      if (!params.colDef.clickable) return;

      const isOpexClaimed = cardTitle?.toLowerCase().includes("opex claimed");
      const isSatNameField = params.field === "SAT Name" || params.field === "satName" || params.field === "sat_name";
      
      // Handle SAT Name click for opex claimed tables
      if (isOpexClaimed && isSatNameField) {
        const satName = params.value;
        if (!satName) {
          console.error("SAT Name not found in cell:", params);
          alert("SAT Name not found. Please try again.");
          return;
        }
        await downloadSatBifurcationData(satName);
        return;
      }

      // Handle regular invoice number clicks
      const invoiceNumber =
        params.row["Invoice Number"] ??
        params.row["invoice_number"] ??
        params.row["invoiceNo"] ??
        params.row.invoice;

      if (!invoiceNumber) {
        console.error("Invoice number not found in row:", params.row);
        alert("Invoice number not found. Please try again.");
        return;
      }

      await fetchReportData(invoiceNumber);
    }, [fetchReportData, downloadSatBifurcationData, cardTitle]);

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: 10 }}>
        <div style={{ flex: "1 1 auto" }}>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pagination
            paginationMode="server"
            rowCount={rowCount}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              if (model.pageSize !== pageSize) setPage(0);
              else setPage(model.page);
              setPageSize(model.pageSize);
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            loading={loading}
            sx={{
              borderRadius: 2,
              border: "1px solid #cfd8dc",
              fontFamily: "'Roboto', sans-serif",
              background: "#f8fafc",
              "& .MuiDataGrid-columnHeader": {
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: 12, sm: 14, md: 16 },
                textAlign: "center",
              },
              "& .MuiDataGrid-cell": {
                fontSize: { xs: 11, sm: 13, md: 14 },
                color: "#263238",
                whiteSpace: "normal",
                wordBreak: "break-word",
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": { backgroundColor: "#fff" },
              "& .MuiDataGrid-row:nth-of-type(even)": { backgroundColor: "#f1f5f9" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#e3f2fd",
                color: "#0d47a1",
                transform: "scale(1.01)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          />
        </div>

        {/* {categoryPopupOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                width: "90%",
                maxWidth: "800px",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0 }}>SAT Data for Category</h3>
                <button
                  style={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                  onClick={() => setCategoryPopupOpen(false)}
                >
                  Close
                </button>
              </div>
              <div style={{ height: "60vh", width: "100%" }}>
                <DataGrid
                  autoHeight
                  rows={categoryRows}
                  columns={categoryColumns}
                  pageSize={10}
                  rowCount={rowCount}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    fontFamily: "'Roboto', sans-serif",
                    backgroundColor: "#fafafaff",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#1976d2",
                      color: "#0e0c0cff",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell": {
                      padding: "8px",
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: "#ffffff",
                    },
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: "#f1f1f1",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.01)",
                      transition: "all 0.2s ease-in-out",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )} */}

        {isReportOpen && invoiceSummary?.invoice_number && (
          <ReportWithPopup
            satData={satData}
            loadSLAData={loadSLAData}
            dailySLAData={dailySLAData}
            invoiceSummary={invoiceSummary}
            billsSLAData={billsSLAData}
            exclusionSLAData={exclusionSLAData}
            slaSummaryData={slaSummaryData}
            downloadSATWiseHierarchy={downloadSATWiseHierarchy}
            divisionWiseSLASummaryDetails={divisionWiseSLASummaryDetails}
            onClose={() => setIsReportOpen(false)}
          />
        )}
      </div>
    );
  };

  export default InvoiceGrid;
