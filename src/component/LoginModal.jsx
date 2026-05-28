// src/component/auth/LoginModal.jsx
import React, { useContext, useState } from "react";
import { X } from "lucide-react";
import { UserContext } from "../context/userContext/UserContext";
import { loginAPI } from "../services/authService";
import LoginCard from "./LoginCard";

const LoginModal = ({ isOpen, onClose }) => {
  const { setMyUserInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loginText, setLoginText] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginText("");

    try {
      const user = await loginAPI(inputUsername, inputPassword);
      setMyUserInfo(user);
      // ล็อกอินสำเร็จใน Modal: แค่ปิด Modal ไม่ต้อง Redirect ไปไหน
      // ลูกค้าจะได้อยู่หน้าเดิมเพื่อกดสั่งต่อได้เลย
      onClose();
    } catch (error) {
      setLoginText(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
      {/* Backdrop: พื้นหลังมืดๆ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-300">
        {/* ปุ่มปิด X */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-[#e4002b] text-white rounded-full flex items-center justify-center border-2 border-[#242424] shadow-[4px_4px_0_#242424] z-10 hover:scale-110 transition-transform"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* นำ LoginCard มาใช้ตรงนี้ */}
        <LoginCard
          inputUsername={inputUsername}
          setInputUsername={setInputUsername}
          inputPassword={inputPassword}
          setInputPassword={setInputPassword}
          isLoading={isLoading}
          loginText={loginText}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
};

export default LoginModal;
