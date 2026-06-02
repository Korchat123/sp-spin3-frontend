import { api } from "../utils/api";
import { setCookie } from "../utils/cookie";

export const loginAPI = async (email, password) => {
  try {
    // Mock Login Fallback for testing
    if (email === "rider@kfcclone.com" && password === "123") {
      const mockUser = {
        id: "mock-rider-id",
        name: "Jim",
        surname: "Carry",
        username: "rider1",
        email: "rider@kfcclone.com",
        phone: "081-999-8888",
        role: "rider",
        token: "mock-jwt-token-for-rider"
      };
      setCookie("token", mockUser.token, 7);
      return mockUser;
    }

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
