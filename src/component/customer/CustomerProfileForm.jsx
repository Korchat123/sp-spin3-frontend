import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Lock,
  Settings2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { UserContext } from "../../context/userContext/UserContext";
import { accountService } from "../../services/accountService";

const toProfileAddress = (address, index = 0) => ({
  id: address?._id || address?.id || Date.now() + index,
  _id: address?._id,
  type: address?.addressName || address?.tag || address?.type || "Home",
  detail: address?.address || address?.detail || "",
  isDefault: address?.isDefault === true,
});

const getInitialAddresses = (userInfo) => {
  const addresses = Array.isArray(userInfo?.addresses)
    ? userInfo.addresses.map(toProfileAddress).filter((address) => address.detail)
    : [];

  if (addresses.length > 0) {
    return addresses.some((address) => address.isDefault)
      ? addresses
      : addresses.map((address, index) => ({ ...address, isDefault: index === 0 }));
  }

  if (userInfo?.address) {
    return [{
      id: Date.now(),
      type: "Home",
      detail: userInfo.address,
      isDefault: true,
    }];
  }

  return [];
};

const toApiAddress = (address) => ({
  _id: address._id,
  addressName: address.type,
  tag: "Other",
  address: address.detail,
  isDefault: address.isDefault,
});

export default function CustomerProfileForm({ userInfo, onClose }) {
  const { setMyUserInfo } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    phone: userInfo?.phone || "",
    email: userInfo?.email || "",
    password: "",
  });

  const [addresses, setAddresses] = useState(() => getInitialAddresses(userInfo));
  const [showSecurity, setShowSecurity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrFormData, setAddrFormData] = useState({
    id: null,
    type: "Home",
    detail: "",
  });

  useEffect(() => {
    setFormData({
      name: userInfo?.name || "",
      phone: userInfo?.phone || "",
      email: userInfo?.email || "",
      password: "",
    });
    setAddresses(getInitialAddresses(userInfo));
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  // --- ลอจิกการจัดการที่อยู่ (Add/Edit/Delete) ---
  const handleOpenAdd = () => {
    // ดัก Max 3 (กันเหนียว)
    if (addresses.length >= 3)
      return alert("สามารถบันทึกที่อยู่ได้สูงสุด 3 รายการเท่านั้นครับ");
    setAddrFormData({ id: null, type: "Home", detail: "" });
    setShowAddrForm(true);
  };

  const handleOpenEdit = (e, addr) => {
    e.stopPropagation();
    setAddrFormData(addr);
    setShowAddrForm(true);
  };

  const handleDeleteAddress = (e, id) => {
    e.stopPropagation();

    // ดัก Min 1 (กันเหนียว)
    if (addresses.length <= 1) {
      return alert(
        "ต้องมีที่อยู่เริ่มต้นอย่างน้อย 1 รายการเพื่อใช้ในการจัดส่งครับ",
      );
    }

    if (window.confirm("ต้องการลบที่อยู่นี้ใช่หรือไม่?")) {
      const newAddresses = addresses.filter((a) => a.id !== id);
      // ถ้าลบอันที่เป็น Default ไป ให้เอาอันแรกที่เหลืออยู่ตั้งเป็น Default แทนอัตโนมัติ
      if (
        addresses.find((a) => a.id === id)?.isDefault &&
        newAddresses.length > 0
      ) {
        newAddresses[0].isDefault = true;
      }
      setAddresses(newAddresses);
    }
  };

  const handleSaveAddress = () => {
    if (!addrFormData.type.trim()) return alert("Please enter an address name");
    if (!addrFormData.detail.trim()) return alert("กรุณากรอกรายละเอียดที่อยู่");

    if (addrFormData.id) {
      // โหมดแก้ไข
      setAddresses(
        addresses.map((a) =>
          a.id === addrFormData.id
            ? { ...addrFormData, isDefault: a.isDefault }
            : a,
        ),
      );
    } else {
      // โหมดเพิ่มใหม่ (เช็ค Max 3 อีกรอบก่อนเซฟ)
      if (addresses.length >= 3)
        return alert("สามารถบันทึกที่อยู่ได้สูงสุด 3 รายการ");
      const newAddr = {
        ...addrFormData,
        id: Date.now(),
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddr]);
    }
    setShowAddrForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const normalizedAddresses = addresses.map((addr, index) => ({
        ...addr,
        isDefault: addresses.some((address) => address.isDefault)
          ? addr.isDefault
          : index === 0,
      }));
      const updated = await accountService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        addresses: normalizedAddresses.map(toApiAddress),
      });

      setMyUserInfo((current) => ({ ...current, ...updated, token: current?.token }));
      alert("อัปเดตข้อมูลและที่อยู่จัดส่งสำเร็จ!");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <User size={12} /> Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] outline-none transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <Phone size={12} /> Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t-2 border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
            <MapPin size={12} className="text-[#e4002b]" /> Saved Addresses
            <span className="text-[10px] text-gray-400 font-medium normal-case ml-1">
              ({addresses.length}/3)
            </span>
          </label>

          {/* UI: เปลี่ยนปุ่ม ADD NEW เป็นข้อความแจ้งเตือนถ้าเต็มโควต้า 3 อัน */}
          {!showAddrForm &&
            (addresses.length < 3 ? (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="text-[10px] font-bold text-[#e4002b] bg-red-50 px-2 py-1 rounded flex items-center gap-1 hover:bg-red-100 cursor-pointer transition-colors"
              >
                <Plus size={12} /> ADD NEW
              </button>
            ) : (
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                <AlertCircle size={10} /> MAX 3 REACHED
              </span>
            ))}
        </div>

        {showAddrForm ? (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#242424] uppercase">
                {addrFormData.id ? "Edit Address" : "Add New Address"}
              </span>
              <button
                type="button"
                onClick={() => setShowAddrForm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <label className="text-[10px] font-bold uppercase text-gray-500">
              Address Name
            </label>
            <input
              type="text"
              value={addrFormData.type}
              onChange={(e) =>
                setAddrFormData({ ...addrFormData, type: e.target.value })
              }
              className="w-full mb-2 border-2 border-gray-200 rounded-lg p-2 text-sm font-bold text-[#242424] outline-none focus:border-[#242424] cursor-pointer"
            />
            <textarea
              rows="2"
              value={addrFormData.detail}
              onChange={(e) =>
                setAddrFormData({ ...addrFormData, detail: e.target.value })
              }
              placeholder="รายละเอียดที่อยู่ เช่น บ้านเลขที่, ซอย, หมู่บ้าน..."
              required
              className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm text-[#242424] outline-none focus:border-[#242424] resize-none mb-2"
            ></textarea>
            <button
              type="button"
              onClick={handleSaveAddress}
              className="w-full bg-[#242424] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e4002b] transition-colors cursor-pointer"
            >
              <Save size={14} /> SAVE ADDRESS
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSetDefault(addr.id)}
                className={`group border-2 rounded-xl p-3 flex items-start gap-3 cursor-pointer transition-all relative ${addr.isDefault ? "border-[#242424] bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="mt-0.5">
                  {addr.isDefault ? (
                    <CheckCircle2 size={18} className="text-[#e4002b]" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 group-hover:border-gray-400"></div>
                  )}
                </div>
                <div className="flex-1 pr-14">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#242424]">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-[#e4002b] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 leading-snug">
                    {addr.detail}
                  </p>
                </div>

                <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => handleOpenEdit(e, addr)}
                    className="p-1.5 text-gray-400 hover:text-[#242424] hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  {/* UI: ซ่อนปุ่มลบถ้าเหลือแค่ 1 รายการ */}
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteAddress(e, addr.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 border-2 border-gray-100 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSecurity(!showSecurity)}
          className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-2.5 flex justify-between items-center cursor-pointer transition-colors"
        >
          <span className="text-sm font-bold text-[#242424] flex items-center gap-2">
            <Settings2 size={16} className="text-[#e4002b]" /> Account &
            Security
          </span>
          {showSecurity ? (
            <ChevronUp size={18} className="text-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-gray-500" />
          )}
        </button>
        {showSecurity && (
          <div className="p-4 bg-white flex flex-col gap-4 border-t-2 border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <Lock size={12} /> Change Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#e4002b] outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || showAddrForm}
        className={`mt-2 w-full font-bold py-3.5 rounded-xl transition-colors border-2 flex items-center justify-center ${isLoading ? "bg-gray-400 text-white cursor-wait border-transparent" : showAddrForm ? "bg-gray-200 text-gray-400 border-transparent cursor-not-allowed" : "bg-[#242424] hover:bg-[#e4002b] text-white hover:border-[#242424] cursor-pointer shadow-[4px_4px_0_#242424] active:translate-y-1 active:shadow-none"}`}
      >
        {isLoading ? "SAVING..." : "SAVE CHANGES"}
      </button>
    </form>
  );
}
