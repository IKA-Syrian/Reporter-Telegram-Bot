import axios from 'axios';
import Cookies from 'js-cookie';
const API_URL = 'https://balqees.iaulibrary.com';

const token = Cookies.get('token');
const username = localStorage.getItem('username');

async function getMetaData(filePath, mimeType) {
    try {
        const response = await axios.post(`${API_URL}/api/media/info`, {
            filePath, mimeType
        }, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function uploadMedia(data) {
    try {
        const response = await axios.post(`${API_URL}/api/media`, data, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

async function getMedia(filePath, reportID) {
    console.log(token)
    try {
        const response = await axios.post(`${API_URL}/api/media/download`, {
            filePath, reportID, username
        }, {
            responseType: 'arraybuffer',
            headers: {
                Authorization: token,
            },

        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export { getMetaData, uploadMedia, getMedia };