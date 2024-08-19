import axios from "axios";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => Cookies.get("token");
const username = localStorage.getItem("username");

async function getUsers() {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/api/users`, {
            withCredentials: true,
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function getUser(username) {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/api/users/${username}`, {
            withCredentials: true,
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function login(data) {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function logout(token) {
    try {
        const response = await axios.post(`${API_URL}/api/auth/logout`, null, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function addUser(data) {
    const token = getToken();
    try {
        const response = await axios.post(`${API_URL}/api/users`, data, {
            withCredentials: true,
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function getUserInfo(userID) {
    const token = getToken();
    try {
        const response = await axios.get(`${API_URL}/api/users/info/${userID}`, {
            withCredentials: true,
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function updateUser(id, data) {
    const token = getToken();
    try {
        const response = await axios.put(`${API_URL}/api/users/${id}`, data, {
            withCredentials: true,
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
async function deleteUser(id) {
    const token = getToken();
    try {
        const response = await axios.delete(`${API_URL}/api/users/${id}?username=${username}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export { getUsers, getUser, login, logout, addUser, getUserInfo, updateUser, deleteUser };