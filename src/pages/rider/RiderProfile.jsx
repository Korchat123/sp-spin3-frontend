import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext/UserContext';
import { accountService } from '../../services/accountService';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Lock, 
  LogOut, 
  Save, 
  Edit2,
  Bike
} from "lucide-react";

const RiderProfile = () => {
  const navigate = useNavigate();
  const { myUserInfo, setMyUserInfo } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: myUserInfo?.name || '',
    surname: myUserInfo?.surname || '',
    phone: myUserInfo?.phone || '081-999-8888',
    email: myUserInfo?.email || '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!myUserInfo) return;

      try {
        const profile = await accountService.getProfile();
        setMyUserInfo((current) => ({ ...current, ...profile, token: current?.token }));
        setFormData({
          name: profile.name || "",
          surname: profile.surname || "",
          phone: profile.phone || "",
          email: profile.email || "",
        });
      } catch (error) {
        console.warn("Unable to load profile data", error);
      }
    };

    loadProfile();
  }, [myUserInfo, setMyUserInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would call an API
    setMyUserInfo({ ...myUserInfo, ...formData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setMyUserInfo(null);
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen font-sans pb-24 relative shadow-2xl">
      <div className="px-6 pt-12 sm:pt-16 pb-4 flex items-center justify-between relative">
        <button 
          onClick={() => navigate('/driver')}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white border-2 border-black rounded-xl shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter text-center">
          My Profile
        </h1>
        <div className="w-10 sm:w-12" />
      </div>

      <main className="px-4 sm:px-6 space-y-6">
        <div className="bg-white rounded-4xl sm:rounded-[2.5rem] p-6 sm:p-7 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#E4002B]/10 rounded-full" />
          <div className="absolute left-0 top-10 w-24 h-24 bg-[#E4002B]/5 rounded-full" />

          <div className="relative text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full border-4 border-gray-100 bg-gray-100 overflow-hidden flex items-center justify-center mb-4">
              {!myUserInfo?.image && <UserIcon size={52} className="text-gray-300" />}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-[0.15em]">
              {myUserInfo?.name} {myUserInfo?.surname}
            </h2>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-gray-500 mt-2">
              Rider Profile
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Role</p>
              <p className="font-black text-sm text-gray-900">Rider</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Phone</p>
              <p className="font-black text-sm text-gray-900">{formData.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-4xl sm:rounded-[2.5rem] p-6 sm:p-7 shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-[0.2em]">
                Personal Info
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] mt-1">
                Update your account details
              </p>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                isEditing ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-[#E4002B] text-white shadow-lg shadow-red-100'
              }`}
            >
              {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500">First name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#E4002B] disabled:bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500">Last name</label>
                <input
                  name="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#E4002B] disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500">Phone number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#E4002B] disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-[0.3em] text-gray-500">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#E4002B] disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-[1.75rem] bg-white border border-gray-200 text-[#E4002B] py-4 font-black uppercase tracking-[0.2em] shadow-lg shadow-red-100 transition hover:translate-x-0.5 hover:translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center gap-2">
            <LogOut size={20} /> LOG OUT
          </div>
        </button>
      </main>
    </div>
  );
};

export default RiderProfile;
