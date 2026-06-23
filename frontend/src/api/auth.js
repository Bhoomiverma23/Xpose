import axios from 'axios'
const API = `${import.meta.env.VITE_API_URL}/api/auth`

export const loginAPI = (data) => axios.post(`${API}/login`, data)
export const signupAPI = (data) => axios.post(`${API}/signup`, data)