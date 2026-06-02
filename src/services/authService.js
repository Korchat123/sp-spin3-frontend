import { api } from "../utils/api";
import { setCookie } from "../utils/cookie";

export const loginAPI = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    
    // The backend returns { token, user: { id, name, role } }
    if (response.token) {
      setCookie("token", response.token, 7);
    }
    // Return the user object for the context, including the token
    return { ...response.user, token: response.token };
    } catch (err) {
    console.error("Auth Service Error:", err);
    throw new Error(err.message || "ระบบตรวจสอบข้อมูลขัดข้อง");
    }
    };

    export const registerAPI = async (userData) => {
    try {
    const response = await api.post("/auth/register", userData);

    if (response.token) {
      setCookie("token", response.token, 7);
    }

    return { ...response.user, token: response.token };
    } catch (err) {
    

    console.error("Register Service Error:", err);
    throw new Error(err.message || "ระบบลงทะเบียนขัดข้อง");
  }
};
