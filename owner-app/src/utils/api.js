import { getCookie } from './cookie'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getCookie('token') && {
    Authorization: `Bearer ${getCookie('token')}`,
  }),
})

export const api = {
  get: (path) =>
    fetch(BASE_URL + path, { headers: getHeaders() })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),

  post: (path, body) =>
    fetch(BASE_URL + path, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),

  patch: (path, body) =>
    fetch(BASE_URL + path, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),

  delete: (path) =>
    fetch(BASE_URL + path, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(r => {
      if (!r.ok && r.status !== 204) throw new Error(r.statusText)
      return r.status === 204 ? null : r.json()
    }),
}
