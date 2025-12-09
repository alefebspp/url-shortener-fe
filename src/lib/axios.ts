import { env } from '@/env'
import axios from 'axios'

const api = axios.create({
  baseURL: `${env.VITE_SERVER_URL}/api`,
})

export default api
