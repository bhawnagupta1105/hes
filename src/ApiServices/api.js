import { Dashboard } from "@mui/icons-material";
import axios from "axios";
import { loadConfig } from '../config';
import { de } from "date-fns/locale";
//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//import { loadConfig } from '../config';

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

//Helper to ensure API is initialized before every request
const ensureApiLoaded = async () => {
  if (!configLoaded) await initApi();
};
export const getdashboarddata = async() =>{
    const requestBody = {
      meterId: "",
      fromDate: "",
      toDate: "",
      requestDate: new Date().toISOString(), // you can send current date if required
      queryParams: "",
      queryParamDictionary: {},
      isHourlyStatusRequired: false,
      parameterName: "",
      operatorName: "",
      parameterValue: 0,
      pageId: "Dashboard",   // 👈 string, not an icon
      displayId: ""
    };
    try{
        const response = await axios.post(`${API_BASE_URL}/Dashboard/GetDashboardTileData`, requestBody,
      {
        headers: { "Content-Type": "application/json" }
      });
        return response.data;
    }catch(error){
        console.error("Error Fetching data:",error);
        throw error;
    }
}

export const getinvoicesatformdata = async() =>{
    try{
        const response = await axios.get(`${API_BASE_URL}/Invoice/GetInvoiceFormConfiguration`);
        return response.data;
    }catch(error){
        console.error("ErrorFetching data:",error);
        throw error;

    }
}
export const submitInvoice = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/Invoice/AddInvoiceClaimRequest`, data); 
  return response.data;
};
export const getCardTableData = async (page, pageSize, cardTitle = "") => {
  try {
    
    const response = await axios.post(
      `${API_BASE_URL}/Dashboard/GetSingleCardDetails?page=${page}&pageSize=${pageSize}`,
      cardTitle,
      {
        headers: {
      "Content-Type": "application/json"
    }
      } // send cardTitle in request body
    );
  console.log("API request payload:", { page, pageSize, cardTitle });

    return response.data;
  } catch (error) {
    console.error("Error fetching card table data:", error);
    throw error;
  }
};

export const getchartdata = async() =>{
    await ensureApiLoaded();
    const requestBody = {
    meterId: "",
    fromDate: "",
    toDate: "",
    requestDate: new Date().toISOString(),
    queryParams: "",
    queryParamDictionary: {
      additionalProp1: "",
      additionalProp2: "",
      additionalProp3: ""
    },
    isHourlyStatusRequired: true,
    parameterName: "",
    operatorName: "",
    parameterValue: 0,
    pageId: "DashboardHighChart",   // important field
    displayId: ""
  };
    try{
        const response = await axios.post(`${API_BASE_URL}/Chart/GetDashboardCharts`, requestBody,
      {
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
        return response.data;
    }catch(error){
        console.error("Error Fetching data:",error);
        throw error;
    }
};

export const getapiversion = async() =>{
    await ensureApiLoaded();
    try{
        const response = await axios.get(`${API_BASE_URL}/Dashboard/GetAppVersion`);
        return response.data;
    }catch(error){
        console.error("Error Fetching data:",error);
        throw error;
    }
}