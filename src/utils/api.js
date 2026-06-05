import { getCookie } from "./cookie";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getHeaders = (isFormData = false) => {
  const token = getCookie("token");
  const headers = {
    ...(token && { "Authorization": `Bearer ${token}` }),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const handleResponse = async (response) => {
  // ดักเคส 204 No Content หรือไม่มี content กลับมา
  if (response.status === 204) return null;

  if (!response.ok) {
    // พยายามดึง message จากหลังบ้าน ถ้าไม่มีให้ใช้ status text แทน
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || errorData.error || `Error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  
  return response.json();
};

export const api = {
  get: (endpoint) => fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() }).then(handleResponse),
  
  post: (endpoint, data) => {
    const isFormData = data instanceof FormData;
    return fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    }).then(handleResponse);
  },

  patch: (endpoint, data) => {
    const isFormData = data instanceof FormData;
    return fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    }).then(handleResponse);
  },

  put: (endpoint, data) => {
    const isFormData = data instanceof FormData;
    return fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    }).then(handleResponse);
  },

  delete: (endpoint) => fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
  }).then(handleResponse),
};
