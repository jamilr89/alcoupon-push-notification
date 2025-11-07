import axios from "axios";
const BASE_URL=process.env.API_URL??'http://localhost:4000'
console.log("BASE_URL:",BASE_URL)

export default axios.create({
    baseURL: BASE_URL
})
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true
})