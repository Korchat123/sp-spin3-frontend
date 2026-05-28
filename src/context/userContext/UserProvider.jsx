// คอยจำว่า "ตอนนี้ใคร Login อยู่" โดยดึงข้อมูลจาก cookies แทน localStorage

import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { getCookie, setCookie, removeCookie } from "../../utils/cookie";

export const UserProvider = ({ children }) => {
  // เปลี่ยนมาดึงข้อมูลจาก cookie แทน localStorage
  const [myUserInfo, setMyUserInfo] = useState(() => {
    try {
      const savedUser = getCookie("userInfo");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing userInfo from cookie:", error);
      return null;
    }
  });

  // Sync state changes to cookies และจัดการการลบ cookie เมื่อ logout
  useEffect(() => {
    if (myUserInfo === null || myUserInfo === undefined) {
      removeCookie("userInfo");
      removeCookie("token");
    } else {
      // เก็บ userInfo ใน cookie (แบบ stringify)
      setCookie("userInfo", JSON.stringify(myUserInfo));
      
      // ถ้ามี token ใน userInfo ให้เก็บแยกใน cookie 'token' ด้วย
      // ถ้าไม่มีให้จำลอง mock-token (ตาม mock API ปัจจุบัน)
      const token = myUserInfo.token || `mock-token-${myUserInfo.username}`;
      setCookie("token", token);
    }
  }, [myUserInfo]);

  return (
    <UserContext.Provider value={{ myUserInfo, setMyUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
