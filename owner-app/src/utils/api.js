import { getCookie } from './cookie'

const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const BASE_URL = RAW_BASE_URL.endsWith('/api') ? RAW_BASE_URL.slice(0, -4) : RAW_BASE_URL.replace(/\/$/, '')

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
      .then(handleResponse),

  post: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(BASE_URL + path, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(handleResponse);
  },

  patch: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(BASE_URL + path, {
      method: 'PATCH',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(handleResponse);
  },

  put: (path, body) =>
    fetch(BASE_URL + path, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(BASE_URL + path, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),
}

async function handleResponse(r) {
  if (r.status === 204) return null;
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    throw new Error(data?.message || data?.error || r.statusText);
  }
  return data;
}
