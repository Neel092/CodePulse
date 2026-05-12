import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

let csrfToken = ''

let csrfFetchPromise: Promise<void> | null = null

export const initCSRF = (): Promise<void> => {
  if (csrfToken) return Promise.resolve()
  if (csrfFetchPromise) return csrfFetchPromise

  csrfFetchPromise = api.get('/api/auth/csrf-token')
    .then(res => {
      csrfToken = res.data.csrfToken
      csrfFetchPromise = null
    })
    .catch(err => {
      csrfFetchPromise = null
      throw err
    })

  return csrfFetchPromise
}

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase()

  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    config.headers['x-csrf-token'] = csrfToken
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config

    const isAuthRoute =
      original?.url?.includes('/api/auth/login') ||
      original?.url?.includes('/api/auth/register') ||
      original?.url?.includes('/api/auth/refresh-token')

    if (
      err.response?.status === 401 &&
      !original?._retry &&
      !isAuthRoute
    ) {
      original._retry = true

      try {
        await api.post('/api/auth/refresh-token')
        return api(original)
      } catch {
        if (typeof window !== 'undefined') {
          const path = window.location.pathname.replace(/\/$/, '') || '/'
          if (path !== '/login' && path !== '/register' && path !== '/') {
            window.location.href = '/login'
          }
        }
      }
    }

    return Promise.reject(err)
  }
)

export default api