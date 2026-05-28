import { getCookie } from "./cookie";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = getCookie("token");
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  // ดักเคส 204 No Content หรือไม่มี content กลับมา
  if (response.status === 204) return null;

  if (!response.ok) {
    // พยายามดึง message จากหลังบ้าน ถ้าไม่มีให้ใช้ status text แทน
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const api = {
  get: (endpoint) => fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() }).then(handleResponse),
  
  post: (endpoint, data) => fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),

  patch: (endpoint, data) => fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),

  delete: (endpoint) => fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
  }).then(handleResponse),
};

