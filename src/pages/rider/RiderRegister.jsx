import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../../services/authService";
import {
  User,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  ArrowLeft,
  Bike
} from "lucide-react";

export default function RiderRegister() {
  const navigate = useNavigate();
  const { setMyUserInfo } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const newUser = await registerAPI({
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "rider",
      });

      setMyUserInfo(newUser);
      alert("Rider Registration Successful!");
      navigate("/driver"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-6 font-['IBM_Plex_Sans_Thai']">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-4xl sm:rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_#000] sm:shadow-[12px_12px_0_#000] p-6 sm:p-10 relative overflow-hidden my-8"
      >
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 -mr-16 -mt-16 rotate-45 z-0"></div>
        <Bike className="absolute top-6 right-6 text-black/20 z-10" size={40} />

        <Link
          to="/login"
          className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 bg-white border-2 border-black p-2 sm:p-3 rounded-full shadow-[4px_4px_0_#000] hover:bg-black hover:text-white transition-all z-20"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="text-center mb-6 sm:mb-8 relative z-10 pt-4 sm:pt-0">
          <span className="text-[#e4002b] font-black tracking-widest text-xs sm:text-sm uppercase">
            Rider Partnership
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-['Bebas_Neue'] mt-2 text-black">
            JOIN AS RIDER
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border-2 border-[#e4002b] text-[#e4002b] px-4 py-3 rounded-xl flex items-center gap-3 font-bold text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:gap-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] sm:text-xs uppercase text-gray-500">First Name</label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border-2 border-black rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] sm:text-xs uppercase text-gray-500">Last Name</label>
              <input
                name="surname"
                type="text"
                required
                value={formData.surname}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border-2 border-black rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] sm:text-xs uppercase text-gray-500">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08X-XXX-XXXX"
                  className="w-full border-2 border-black rounded-2xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] sm:text-xs uppercase text-gray-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full border-2 border-black rounded-2xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-[10px] sm:text-xs uppercase text-gray-500">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full border-2 border-black rounded-2xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] sm:text-xs uppercase text-gray-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border-2 border-black rounded-2xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[10px] sm:text-xs uppercase text-gray-500">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border-2 border-black rounded-2xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-bold text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 sm:mt-10 w-full bg-black text-white py-3.5 sm:py-4 rounded-2xl font-['Bebas_Neue'] text-2xl sm:text-3xl tracking-widest border-2 border-black shadow-[4px_4px_0_#FDE68A] sm:shadow-[6px_6px_0_#FDE68A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "BECOMING A RIDER..." : "APPLY NOW"}
        </button>

        <div className="mt-6 text-center font-bold text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest">
          Already a rider?{" "}
          <Link
            to="/login"
            className="text-black underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
