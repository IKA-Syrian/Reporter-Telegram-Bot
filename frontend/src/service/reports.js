import axios from "axios";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => Cookies.get("token");
const username = localStorage.getItem("username");
async function getReports(count, passedToken) {
    const token = passedToken || getToken();
    if (count) {
        try {
            const response = await axios.get(`${API_URL}/api/reports?count=${count}`, {
                headers: {
                    Authorization: passedToken,
                }
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    } else {
        try {
            const response = await axios.get(`${API_URL}/api/reports`, {
                headers: {
                    Authorization: token,
                }
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
}
async function getReportsChart(peroid) {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/api/reports/chart?peroid=${peroid}`, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
async function getReport(id) {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/api/reports/${id}`, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
async function createReport(data) {
    const token = getToken();
    try {
        const response = await axios.post(`${API_URL}/api/reports`, data, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function updateReport(id, data) {
    const token = getToken();
    try {
        const response = await axios.put(`${API_URL}/api/reports/${id}`, { data, username }, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function deleteReport(id) {
    const token = getToken();
    try {
        const response = await axios.delete(`${API_URL}/api/reports/${id}?username=${username}`, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export { getReports, getReportsChart, getReport, createReport, updateReport, deleteReport };