import axios from 'axios'

const API = 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('xpose_token')

export const analyzeProfile = (formData) =>
  axios.post(`${API}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${getToken()}`
    }
  })

export const getReports = () =>
  axios.get(`${API}/reports`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })

export const getReport = (id) =>
  axios.get(`${API}/reports/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })