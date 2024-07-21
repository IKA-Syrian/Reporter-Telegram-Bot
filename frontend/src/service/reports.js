import axios from "axios";
import Cookies from "js-cookie";
const API_URL = "https://balqees.iaulibrary.com";
const token = Cookies.get("token");
const username = localStorage.getItem("username");
async function getReports(count, passedToken) {
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
async function getReport(id) {
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
    try {
        const response = await axios.delete(`${API_URL}/api/reports/${id}`, { username }, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export { getReports, getReport, createReport, updateReport, deleteReport };