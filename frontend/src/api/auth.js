import axios from 'axios'

const API = 'http://localhost:5000/api/auth'

export const loginAPI = (data) => axios.post(`${API}/login`, data)
export const signupAPI = (data) => axios.post(`${API}/signup`, data)