export const getSocketUrl = (path) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
  const url = new URL(apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = path;
  url.search = "";
  url.hash = "";
  return url.toString();
};
