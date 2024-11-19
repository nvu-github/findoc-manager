import axios from 'axios'
import { API_VERSION } from '../constants'

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}${API_VERSION.V1}`,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
