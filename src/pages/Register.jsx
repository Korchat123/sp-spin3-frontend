import { useContext, useState } from "react";
import { UserContext } from "../context/userContext/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../services/authService";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"; // เพิ่ม Icons

export default function Register() {
  const navigate = useNavigate();
  const { setMyUserInfo } = useContext(UserContext);

  // 1. Single state for all form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 4. Generic handle change for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation Logic
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match! รหัสผ่านไม่ตรงกันครับ");
      setIsLoading(false);
      return;
    }

    try {
      // Create new user object
      const newUser = await registerAPI({
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "customer", // Default role
      });

      console.log("Registered User:", newUser);

      // บันทึกเข้า Context
      setMyUserInfo(newUser);

      // แจ้งเตือนสวยๆ แล้วพากลับหน้าหลัก หรือหน้าเมนู
      alert("ยินดีต้อนรับสู่ Serious Club! สมัครสมาชิกสำเร็จ");
      navigate("/menu"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center p-4 font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      {/* กล่อง Form หลัก */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-3xl border-4 border-[#242424] shadow-[12px_12px_0_#242424] p-8 md:p-10 relative"
      >
        {/* ปุ่มกลับไปหน้า Login */}
        <Link
          to="/login"
          className="absolute -top-5 -left-5 bg-white border-2 border-[#242424] p-3 rounded-full shadow-[4px_4px_0_#242424] hover:bg-[#e4002b] hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </Link>

        <div className="text-center mb-8">
          <span className="text-[#e4002b] font-black tracking-widest text-sm uppercase">
            Join The Club
          </span>
          <h1 className="text-5xl font-black font-['Bebas_Neue'] mt-2 text-[#242424]">
            SERIOUS REGISTER
          </h1>
        </div>

        {/* กล่องแสดง Error */}
        {error && (
          <div className="mb-6 bg-red-100 border-2 border-[#e4002b] text-[#e4002b] px-4 py-3 rounded-xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* ส่วนของ Name & Surname (แบ่ง 2 คอลัมน์) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm uppercase">
                Name <span className="text-[#e4002b]">*</span>
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Somchai"
                className="w-full border-2 border-[#242424] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:border-[#e4002b] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm uppercase">
                Surname <span className="text-[#e4002b]">*</span>
              </label>
              <input
                name="surname"
                type="text"
                required
                value={formData.surname}
                onChange={handleChange}
                placeholder="Happy"
                className="w-full border-2 border-[#242424] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:border-[#e4002b] transition-all"
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1 relative">
            <label className="font-bold text-sm uppercase">
              Username <span className="text-[#e4002b]">*</span>
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                name="username"
                type="text"
                minLength="4"
                maxLength="15"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Create a cool username"
                className="w-full border-2 border-[#242424] rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:border-[#e4002b] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 relative">
            <label className="font-bold text-sm uppercase">
              Email <span className="text-[#e4002b]">*</span>
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border-2 border-[#242424] rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:border-[#e4002b] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1 relative">
              <label className="font-bold text-sm uppercase">
                Password <span className="text-[#e4002b]">*</span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border-2 border-[#242424] rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:border-[#e4002b] transition-all"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1 relative">
              <label className="font-bold text-sm uppercase">
                Confirm Password <span className="text-[#e4002b]">*</span>
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border-2 border-[#242424] rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#e4002b] focus:border-[#e4002b] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ปุ่ม Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full bg-[#e4002b] text-white py-4 rounded-xl font-['Bebas_Neue'] text-2xl tracking-widest border-2 border-[#242424] shadow-[6px_6px_0_#242424] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#242424] transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "SIGNING UP..." : "SIGN UP NOW"}
        </button>

        {/* ลิงก์ไป Login */}
        <div className="mt-6 text-center font-bold text-sm">
          Already part of the club?{" "}
          <Link
            to="/login"
            className="text-[#e4002b] hover:underline decoration-2 underline-offset-4"
          >
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  );
}
