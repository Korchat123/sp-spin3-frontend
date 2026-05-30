import { getCookie } from './cookie'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = getCookie('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export const api = {
  get: (path) =>
    fetch(BASE_URL + path, { headers: getHeaders() })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() }),

  post: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(BASE_URL + path, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() });
  },

  patch: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(BASE_URL + path, {
      method: 'PATCH',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() });
  },

  delete: (path) =>
    fetch(BASE_URL + path, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(r => {
      if (!r.ok && r.status !== 204) throw new Error(r.statusText)
      return r.status === 204 ? null : r.json()
    }),
}
