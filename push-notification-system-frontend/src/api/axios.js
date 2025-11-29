import axios from "axios";

// prefer REACT_APP_API_URL if provided, otherwise use same-origin
const BASE_URL = '/';
console.log("BASE_URL:", BASE_URL);


export default axios.create({
    baseURL: BASE_URL
})
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true
})