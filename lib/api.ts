import axios from "axios"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    const supabase = createClientComponentClient({ supabaseUrl: "https://qfrykomckfnnbrjisfqj.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcnlrb21ja2ZubmJyamlzZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNTYxNjAsImV4cCI6MjA1NzgzMjE2MH0.-C6hY6haFUkSMJzCV849xxsqtb948sDpLI8zKH94wZs" })
    const { data } = await supabase.auth.getSession()

    if (data.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`
    }

    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

export default api

