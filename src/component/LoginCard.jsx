// src/component/auth/LoginCard.jsx
import { Link } from "react-router-dom";

const LoginCard = ({
  inputEmail,
  setInputEmail,
  inputPassword,
  setInputPassword,
  isLoading,
  loginText,
  onSubmit,
}) => {
  return (
    <div className="bg-white border-4 border-[#242424] shadow-[16px_16px_0_#242424] rounded-4xl p-8 md:p-12 w-full max-w-md relative overflow-hidden">
      {/* พาดหัว */}
      <div className="mb-8 text-center">
        <h1 className="font-['Bebas_Neue'] text-5xl tracking-wider text-[#e4002b] mb-2">
          WELCOME BACK
        </h1>
        <p className="text-gray-500 text-sm font-bold">
          STAY SERIOUS. LOGIN TO ORDER.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* ช่องกรอก Email */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase tracking-wide">
            Email
          </label>
          <input
            className="w-full p-4 bg-[#f0f0f0] border-2 border-[#242424] rounded-xl outline-none focus:bg-white focus:border-[#e4002b] transition-colors"
            placeholder="Enter your email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        {/* ช่องกรอก Password */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase tracking-wide">
            Password
          </label>
          <input
            className="w-full p-4 bg-[#f0f0f0] border-2 border-[#242424] rounded-xl outline-none focus:bg-white focus:border-[#e4002b] transition-colors"
            placeholder="••••••••"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        {/* ข้อความ Error (ถ้ามี) */}
        {loginText && (
          <div className="bg-red-100 border-l-4 border-[#e4002b] text-[#e4002b] p-3 text-sm font-bold animate-pulse">
            {loginText}
          </div>
        )}

        {/* ปุ่ม Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full bg-[#e4002b] text-white font-['Bebas_Neue'] text-3xl tracking-widest py-3 rounded-xl transition-all duration-300 hover:translate-y-1 hover:shadow-[4px_4px_0_#242424] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[8px_8px_0_#242424] cursor-pointer"
        >
          {isLoading ? "FRYING..." : "LOG IN"}
        </button>

        {/* ลิ้งค์ไปหน้าสมัครสมาชิก */}
        <div className="text-center mt-4">
          <span className="text-gray-500 font-bold text-sm">
            NEW HERE?{" "}
            <Link
              to="/register"
              className="text-[#DC5F00] hover:text-[#e4002b] transition-colors underline decoration-2 underline-offset-4"
            >
              CREATE ACCOUNT
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;
