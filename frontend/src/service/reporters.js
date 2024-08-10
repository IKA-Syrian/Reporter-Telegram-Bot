import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => Cookies.get("token");
const username = localStorage.getItem("username");

async function getReporters(count, passedToken) {
    const token = passedToken || getToken();
    if (count) {
        try {
            const response = await axios.get(`${API_URL}/api/reporters?count=${count}`, {
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
            const response = await axios.get(`${API_URL}/api/reporters`, {
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
async function getReportersChart(peroid) {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/api/reporters/chart?peroid=${peroid}`, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
async function getReporter(id) {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/api/reporters/${id}`, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
async function createReporter(data) {
    const token = getToken();
    try {
        const response = await axios.post(`${API_URL}/api/reporters`, data, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function updateReporter(id, data) {
    const token = getToken();
    try {
        const response = await axios.put(`${API_URL}/api/reporters/${id}`, { data, username }, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function deleteReporter(id) {
    const token = getToken();
    try {
        const response = await axios.delete(`${API_URL}/api/reporters/${id}`, {
            headers: {
                Authorization: token,
            }
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export { getReporters, getReportersChart, getReporter, createReporter, updateReporter, deleteReporter };