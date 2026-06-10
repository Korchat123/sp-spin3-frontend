const BASE_URL_RAW = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = BASE_URL_RAW.endsWith("/api")
  ? BASE_URL_RAW.slice(0, -4)
  : BASE_URL_RAW.replace(/\/$/, "");

const getHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(r) {
  if (r.status === 204) return null;
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    throw new Error(data?.message || data?.error || r.statusText);
  }
  return data;
}

export const api = {
  get: (path) =>
    fetch(BASE_URL + path, { headers: getHeaders() }).then(handleResponse),

  post: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(BASE_URL + path, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(handleResponse);
  },

  put: (path, body) =>
    fetch(BASE_URL + path, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(BASE_URL + path, {
      method: "PATCH",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(handleResponse);
  },

  delete: (path) =>
    fetch(BASE_URL + path, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleResponse),
};
