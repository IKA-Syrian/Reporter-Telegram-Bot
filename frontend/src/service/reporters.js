import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;
const token = Cookies.get("token");
const username = localStorage.getItem("username");

async function getReporters(count, passedToken) {

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
async function getReporter(id) {
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
export { getReporters, getReporter, createReporter, updateReporter, deleteReporter };