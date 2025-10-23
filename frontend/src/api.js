import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001' });
const token = localStorage.getItem('token');
if(token) API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
export default API;
