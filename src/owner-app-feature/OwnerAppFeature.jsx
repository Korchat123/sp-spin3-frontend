import React, { useCallback, useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext/UserContext";
import { getCookie } from "../utils/cookie";

// Import Owner App Contexts using the alias
import { AuthStoreProvider } from "@owner-app/context/AuthContext";
import { UIProvider } from "@owner-app/context/UIContext";
import { NotificationProvider } from "@owner-app/context/NotificationContext";
import { StoreDataProvider } from "@owner-app/context/StoreDataContext";
import ProtectedRoute from "@owner-app/components/common/ProtectedRoute";

// Import Owner App Components/Pages
import Layout from "@owner-app/components/layout/Layout";
import Dashboard from "@owner-app/pages/Dashboard";
import Tables from "@owner-app/pages/Tables";
import Orders from "@owner-app/pages/Orders";
import Menu from "@owner-app/pages/Menu";
import Stock from "@owner-app/pages/Stock";
import WasteLog from "@owner-app/pages/WasteLog";
import Promotions from "@owner-app/pages/Promotions";
import Customers from "@owner-app/pages/Customers";
import Staff from "@owner-app/pages/Staff";

const OWNER_NAV_PATHS = new Set([
  "/",
  "/tables",
  "/orders",
  "/menu",
  "/stock",
  "/waste",
  "/promotions",
  "/customers",
  "/staff",
]);

const toIntegratedOwnerPath = (pathname) =>
  pathname === "/" ? "/owner" : `/owner${pathname}`;

const OwnerAppFeature = () => {
  const { myUserInfo, setMyUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // Synchronize authentication state before rendering AuthStoreProvider
  useEffect(() => {
    if (myUserInfo && myUserInfo.role === "owner" && !localStorage.getItem("owner_user")) {
      console.log("[OwnerFeature] Pre-syncing auth state to localStorage");
      const token = myUserInfo.token || getCookie("token");
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("owner_user", JSON.stringify(myUserInfo));
      }
    }
  }, [myUserInfo]);

  const handleOwnerClickCapture = useCallback(
    (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href === "#") {
        if (anchor.textContent.trim().toLowerCase() === "log out") {
          setTimeout(() => setMyUserInfo(null), 0);
        }
        return;
      }

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (!OWNER_NAV_PATHS.has(url.pathname)) return;

      event.preventDefault();
      event.stopPropagation();
      navigate(`${toIntegratedOwnerPath(url.pathname)}${url.search}${url.hash}`);
    },
    [navigate, setMyUserInfo],
  );

  return (
    <div onClickCapture={handleOwnerClickCapture}>
      <AuthStoreProvider>
        <Routes>
          {/*
            We removed the internal 'login' route to avoid duplication.
            The owner app's ProtectedRoute automatically redirects to the main app's /login
            when not authenticated, which then redirects back to /owner after successful login.
          */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NotificationProvider>
                  <UIProvider>
                    <StoreDataProvider>
                      <Layout />
                    </StoreDataProvider>
                  </UIProvider>
                </NotificationProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tables" element={<Tables />} />
            <Route path="orders" element={<Orders />} />
            <Route path="menu" element={<Menu />} />
            <Route path="stock" element={<Stock />} />
            <Route path="waste" element={<WasteLog />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="customers" element={<Customers />} />
            <Route path="staff" element={<Staff />} />
          </Route>

          {/* Fallback to owner root or main login if something goes wrong */}
          <Route path="*" element={<Navigate to="/owner" replace />} />
        </Routes>
      </AuthStoreProvider>
    </div>
  );
};

export default OwnerAppFeature;
