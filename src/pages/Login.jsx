// src/pages/Login.jsx
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext/UserContext";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../services/authService";
import LoginCard from "../component/LoginCard";

export default function Login() {
  const navigate = useNavigate();
  const { myUserInfo, setMyUserInfo } = useContext(UserContext);

  // --- States ---
  const [loginText, setLoginText] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ป้องกันกรณีล็อกอินอยู่แล้วแต่ยังพยายามเข้าหน้า Login
  useEffect(() => {
    if (myUserInfo) {
      // ถ้าเป็นลูกค้าให้ไปหน้าเมนู ถ้าเป็นบทบาทอื่นให้ไปหน้า Dashboard ของตัวเอง
      if (myUserInfo.role === "customer") navigate("/menu");
      else if (myUserInfo.role === "cook") navigate("/cookBoard");
      else if (myUserInfo.role === "cashier") navigate("/cashier/orders");
    }
  }, [myUserInfo, navigate]);

  const checkLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginText("");

    try {
      const user = await loginAPI(inputEmail, inputPassword);
      setMyUserInfo(user);
      // การนำทาง (Navigation) จะถูกจัดการโดย useEffect ด้านบนเมื่อ myUserInfo เปลี่ยนแปลง
    } catch (error) {
      setLoginText(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutBtn = (e) => {
    e.preventDefault();
    setMyUserInfo(null);
  };

  const redirectAfterLogin = (user) => {
    if (user.role === "customer") {
      // ถ้าลูกค้ากด Login มาจากหน้าไหน (เช่น ตะกร้า) ให้เด้งกลับไปที่นั่น
      // หรือถ้าไม่มีข้อมูล ให้ไปหน้า /menu เป็นพื้นฐาน
      const lastPath = localStorage.getItem("lastPath") || "/menu";
      navigate(lastPath);
    } else if (user.role === "cook") {
      navigate("/cookBoard");
    } else if (user.role === "cashier") {
      navigate("/cashier/orders");
    } else if (user.role === "rider") {
      navigate("/rider-dashboard");
    } else if (user.role === "owner") {
      navigate("/owner-dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#eeeeee] flex items-center justify-center p-6 font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* === ฝั่งซ้าย: โซน Graphic (SFC Style) === */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-center">
          <div className="w-full aspect-square bg-[#e4002b] rounded-[3rem] border-4 border-[#242424] flex items-center justify-center relative overflow-hidden transition-transform duration-500">
            <img
              src="/images/login-left.png"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* === ฝั่งขวา: โซนฟอร์ม / สถานะการล็อกอิน === */}
        <div className="flex-1 flex justify-center w-full">
          {!myUserInfo ? (
            <LoginCard
              inputEmail={inputEmail}
              setInputEmail={setInputEmail}
              inputPassword={inputPassword}
              setInputPassword={setInputPassword}
              isLoading={isLoading}
              loginText={loginText}
              onSubmit={checkLogin}
            />
          ) : (
            // การ์ดสถานะ "YOU'RE IN"
            <div className="bg-white border-4 border-[#242424] shadow-[16px_16px_0_#242424] rounded-4xl p-10 md:p-12 w-full max-w-sm text-center">
              <div className="w-24 h-24 bg-[#DC5F00] border-4 border-[#242424] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[6px_6px_0_#242424]"></div>

              <h2 className="font-['Bebas_Neue'] text-5xl mb-6 tracking-tight text-[#242424]">
                YOU'RE IN!
              </h2>

              <div className="bg-[#eeeeee] border-2 border-[#242424] rounded-2xl p-5 mb-8 text-left space-y-3">
                <div>
                  <p className="font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                    Active Role
                  </p>
                  <p className="font-black text-2xl text-[#e4002b] font-['Bebas_Neue'] uppercase leading-none">
                    {myUserInfo.role}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <p className="font-bold text-[10px] text-gray-500 uppercase tracking-widest">
                    Account Name
                  </p>
                  <p className="font-black text-xl leading-none">
                    {myUserInfo.name}
                  </p>
                </div>
              </div>

              <button
                onClick={logoutBtn}
                className="w-full bg-[#242424] text-white font-['Bebas_Neue'] text-2xl tracking-widest py-4 rounded-xl border-2 border-[#242424] shadow-[6px_6px_0_#e4002b] transition-all duration-300 hover:translate-y-1 hover:shadow-[2px_2px_0_#e4002b] active:scale-95"
              >
                LOG OUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
