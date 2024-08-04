import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const token = Cookies.get("token");
const username = localStorage.getItem("username");

async function getLogs() {
    try {
        const response = await axios.get(`${API_URL}/api/logs`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function getLog(id) {
    try {
        const response = await axios.get(`${API_URL}/api/logs/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export { getLogs, getLog };