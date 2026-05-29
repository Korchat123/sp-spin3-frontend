import { useContext, useEffect, useMemo, useState } from "react";
import { Mail, ShieldCheck, User, Save, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { UserContext } from "../../context/userContext/UserContext";
import { accountService } from "../../services/accountService";

const emptyProfile = {
  name: "",
  surname: "",
  username: "",
  email: "",
  role: "customer",
};

export default function CustomerAccountPage() {
  const { myUserInfo, setMyUserInfo } = useContext(UserContext);
  const [profile, setProfile] = useState({ ...emptyProfile, ...myUserInfo });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const displayName = useMemo(
    () => [profile.name, profile.surname].filter(Boolean).join(" ") || profile.username || "Customer",
    [profile.name, profile.surname, profile.username],
  );

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await accountService.getProfile();
        if (ignore) return;
        setProfile({ ...emptyProfile, ...data });
        setMyUserInfo((current) => ({ ...current, ...data, token: current?.token }));
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load account details");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [setMyUserInfo]);

  const updateProfileField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setMessage("");

    try {
      const updated = await accountService.updateProfile({
        name: profile.name.trim(),
        surname: profile.surname.trim(),
        username: profile.username.trim(),
        email: profile.email.trim(),
      });
      setProfile({ ...emptyProfile, ...updated });
      setMyUserInfo((current) => ({ ...current, ...updated, token: current?.token }));
      setMessage("Account details updated.");
    } catch (err) {
      setError(err.message || "Unable to update account details");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setError("");
    setMessage("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirmation do not match.");
      setSavingPassword(false);
      return;
    }

    try {
      const response = await accountService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage(response.message || "Password changed successfully.");
    } catch (err) {
      setError(err.message || "Unable to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] px-4 py-10 font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      <main className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#e4002b]">
              Customer Account
            </p>
            <h1 className="mt-2 font-['Bebas_Neue'] text-6xl tracking-wider">
              EDIT INFO
            </h1>
          </div>
          <div className="rounded-2xl border-4 border-[#242424] bg-white px-5 py-4 shadow-[6px_6px_0_#242424]">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Signed in as</p>
            <p className="text-xl font-black">{displayName}</p>
          </div>
        </div>

        {(error || message) && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
              error
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-green-300 bg-green-50 text-green-700"
            }`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{error || message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-4xl border-4 border-[#242424] bg-[#242424] p-6 text-white shadow-[8px_8px_0_#e4002b]">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#e4002b] shadow-[5px_5px_0_#111]">
              <User size={44} />
            </div>
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wider">{displayName}</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-200">
                <Mail size={16} className="text-[#e4002b]" />
                {profile.email || "No email"}
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <ShieldCheck size={16} className="text-[#e4002b]" />
                {(profile.role || "customer").toUpperCase()}
              </div>
            </div>
          </section>

          <form
            onSubmit={handleProfileSubmit}
            className="rounded-4xl border-4 border-[#242424] bg-white p-6 shadow-[8px_8px_0_#242424] lg:col-span-2"
          >
            <h2 className="mb-5 font-['Bebas_Neue'] text-4xl tracking-wider">ACCOUNT DETAILS</h2>
            {loading ? (
              <div className="py-16 text-center font-bold text-gray-400">Loading account...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-bold uppercase">
                  First Name
                  <input
                    value={profile.name}
                    onChange={(event) => updateProfileField("name", event.target.value)}
                    className="rounded-xl border-2 border-[#242424] bg-[#eeeeee] p-4 normal-case outline-none focus:bg-white focus:border-[#e4002b]"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-bold uppercase">
                  Surname
                  <input
                    value={profile.surname}
                    onChange={(event) => updateProfileField("surname", event.target.value)}
                    className="rounded-xl border-2 border-[#242424] bg-[#eeeeee] p-4 normal-case outline-none focus:bg-white focus:border-[#e4002b]"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-bold uppercase">
                  Username
                  <input
                    value={profile.username}
                    onChange={(event) => updateProfileField("username", event.target.value)}
                    className="rounded-xl border-2 border-[#242424] bg-[#eeeeee] p-4 normal-case outline-none focus:bg-white focus:border-[#e4002b]"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-bold uppercase">
                  Email
                  <input
                    value={profile.email}
                    onChange={(event) => updateProfileField("email", event.target.value)}
                    className="rounded-xl border-2 border-[#242424] bg-[#eeeeee] p-4 normal-case outline-none focus:bg-white focus:border-[#e4002b]"
                    type="email"
                    required
                  />
                </label>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || savingProfile}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#242424] bg-[#e4002b] py-4 font-['Bebas_Neue'] text-2xl tracking-widest text-white shadow-[6px_6px_0_#242424] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0_#242424] disabled:cursor-wait disabled:opacity-60"
            >
              <Save size={18} />
              {savingProfile ? "SAVING" : "SAVE DETAILS"}
            </button>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-4xl border-4 border-[#242424] bg-white p-6 shadow-[8px_8px_0_#242424] lg:col-span-3"
          >
            <h2 className="mb-5 flex items-center gap-3 font-['Bebas_Neue'] text-4xl tracking-wider">
              <KeyRound className="text-[#e4002b]" />
              CHANGE PASSWORD
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm font-bold uppercase">
                Current Password
                <input
                  value={passwords.currentPassword}
                  onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
                  className="rounded-xl border-2 border-[#242424] bg-[#eeeeee] p-4 normal-case outline-none focus:bg-white focus:border-[#e4002b]"
                  type="password"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-bold uppercase">
                New Password
                <input
                  value={passwords.newPassword}
                  onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
                  className="rounded-xl border-2 border-[#242424] bg-[#eeeeee] p-4 normal-case outline-none focus:bg-white focus:border-[#e4002b]"
                  type="password"
                  minLength={6}
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-bold uppercase">
                Confirm New Password
                <input
                  value={passwords.confirmPassword}
                  onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
                  className="rounded-xl border-2 border-[#242424] bg-[#eeeeee] p-4 normal-case outline-none focus:bg-white focus:border-[#e4002b]"
                  type="password"
                  minLength={6}
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#242424] bg-[#242424] py-4 font-['Bebas_Neue'] text-2xl tracking-widest text-white shadow-[6px_6px_0_#e4002b] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0_#e4002b] disabled:cursor-wait disabled:opacity-60"
            >
              <KeyRound size={18} />
              {savingPassword ? "UPDATING" : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
