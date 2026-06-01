import { useEffect } from "react";
import { redirectToOwnerApp } from "../../utils/navigation";

/**
 * A specialized component that handles redirection to the owner app.
 * By using this as a route, we can treat the owner app as a "path" in the main app.
 */
const OwnerRedirect = () => {
  useEffect(() => {
    // Redirect to the owner app (login or dashboard)
    redirectToOwnerApp();
  }, []);

  return (
    <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center font-['Bebas_Neue'] text-3xl tracking-widest text-[#242424]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#e4002b]"></div>
        <p>CONNECTING TO OWNER DASHBOARD...</p>
      </div>
    </div>
  );
};

export default OwnerRedirect;
