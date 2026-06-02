// src/component/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext/UserContext"; // เช็ค path นี้ให้ตรงกับโฟลเดอร์จริงของคุณด้วยนะครับ

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { myUserInfo } = useContext(UserContext);
  const location = useLocation();

  // 1. ถ้ายังไม่ได้ล็อกอิน ให้เตะกลับไปหน้า Login
  if (!myUserInfo) {
    // ถ้าเป็น path ของ rider ให้เด้งไปหน้า login หลัก
    if (location.pathname.startsWith("/driver")) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // 2. ถ้าล็อกอินแล้ว เช็ค Role
  // (ถ้าเป็นโหมด Dev หรือมี Role dev ปล่อยผ่านได้เลย หรือจะใช้เช็คตาม Role ปกติ)
  if (allowedRoles && !allowedRoles.includes(myUserInfo.role)) {
    // If user is a cook, always redirect to cookBoard
    if (myUserInfo.role === "cook") {
      return <Navigate to="/cookBoard" replace />;
    }
    // ให้เตะกลับไปหน้า Index/Home
    return <Navigate to="/" replace />;
  }

  // 3. ถ้าล็อกอินแล้ว และ Role ถูกต้อง ให้แสดงผลหน้าจอตามปกติ
  return children;
};

export default ProtectedRoute;
