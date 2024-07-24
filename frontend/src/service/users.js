import axios from "axios";

const API_URL = "https://balqees.iaulibrary.com";

async function getUsers(token) {
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

async function getUser(username, passedToken) {
    try {
        const response = await axios.get(`${API_URL}/api/users/${username}`, {
            withCredentials: true,
            headers: {
                Authorization: passedToken,
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
    try {
        const response = await axios.post(`${API_URL}/api/users`, data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function updateUser(id, data, token) {
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
async function deleteUser(id, token) {
    try {
        const response = await axios.delete(`${API_URL}/api/users/${id}`, {
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
export { getUsers, getUser, login, logout, addUser, updateUser, deleteUser };