
import axios from "axios";
import { loadConfig } from '../config';
//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
let API_BASE_URL = '';
let configLoaded = false;

// Load API_BASE_URL from config.json
export const initApi = async () => {
  if (!configLoaded) {
    const config = await loadConfig();
    API_BASE_URL = config.API_BASE_URL;
    configLoaded = true;
  }
};
const ensureApiLoaded = async () => {
  if (!configLoaded) await initApi();
};
export const getSATBifurcationDetails = async(invoiceNumber) => {
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/GetSATBifurcationDetails`,
            {}, // empty body
            {
                params: { invoiceNumber } // query params
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching SATBifurcationDetails:", error);
        throw error;
    }
};

export const getLoadSLADetails = async(invoiceNumber) => {
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/GetLoadSLADetails`,
            {},
            {
                params: { invoiceNumber }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching LoadSLADetails:", error);
        throw error;
    }
};

export const getDailySLADetails = async(invoiceNumber) => {
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/GetDailySLADetails`,
            {},
            {
                params: { invoiceNumber }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching DailySLADetails:", error);
        throw error;
    }
};

export const getBillSLADetails = async(invoiceNumber) => {
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/GetBillSLADetails`,
            {},
            {
                params: { invoiceNumber }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching BillSLADetails:", error);
        throw error;
    }
};

export const getExclusionSummaryDetails = async(invoiceNumber) => {
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/GetExclusionSummaryDetails`,
            {},
            {
                params: { invoiceNumber }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching ExclusionSummaryDetails:", error);
        throw error;
    }
};
export const getSLASummaryDetails = async(invoiceNumber) => {
    debugger
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/GetSLASummaryDetails`,
            {},
            {
                params: { invoiceNumber }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching BillSLADetails:", error);
        throw error;
    }
};

export const getdownloadSATWiseHierarchy = async(satName) => {
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/DownloadSATWiseHierarchy`,
            {},
            {
                params: { satName }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching downloadSATWiseHierarchy:", error);
        throw error;
    }
};

export const getDivisionWiseSLASummaryDetails = async(invoiceNumber) => {
    debugger
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/GetDivisionWiseSLASummaryDetails`,
            {},
            {
                params: { invoiceNumber }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching DivisionWiseSLASummaryDetails:", error);
        throw error;
    }
};
export const getDownloadDetailedExclusionReport = async(invoiceNumber,satName,exclusion) => {
    debugger
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/DownloadDetailedExclusionReport`,
            {},
            {
                params: { invoiceNumber }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching DownloadDetailedExclusionReport:", error);
        throw error;
    }
};
export const getDownloadMetricWiseExclusionReport = async(invoiceNumber,metric) => {
    debugger
    try {
         await ensureApiLoaded();
        const response = await axios.post(
            `${API_BASE_URL}/Report/DownloadMetricWiseExclusionReport`,
            {},
            {
                params: { invoiceNumber ,metric}
            }
        );
        return response.data;
    } catch(error) {
        console.error("Error fetching DownloadDetailedExclusionReport:", error);
        throw error;
    }
};