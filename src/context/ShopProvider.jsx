import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MENU } from "../assets/menuData";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // --- Cart State ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("crispyCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // --- UI Global State ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  
  // --- Branch State ---
  const [selectedBranch, setSelectedBranch] = useState(() =>
    localStorage.getItem("selectedBranch")
  );

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("crispyCart", JSON.stringify(cart));
  }, [cart]);

  // Derived state
  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.qty, 0), 
  [cart]);

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) return { ...item, qty: item.qty + delta };
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const addToCart = (id, qty = 1) => {
    setCart((prev) => {
      const menuItem = MENU.find((m) => m.id === id);
      if (!menuItem) {
        console.warn(`Menu item with id ${id} not found`);
        return prev;
      }

      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + qty } : item
        );
      }
      
      // Store full menu item data with qty
      return [
        ...prev,
        {
          id,
          name: menuItem.name,
          price: menuItem.price,
          img: menuItem.img,
          qty,
        },
      ];
    });
  };

  const showToast = (msg, duration = 3000) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), duration);
  };

  const selectBranch = (branchId) => {
    setSelectedBranch(branchId);
    localStorage.setItem("selectedBranch", branchId);
  };

  const value = {
    cart,
    setCart,
    cartCount,
    updateCartQty,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    toastMsg,
    showToast,
    selectedBranch,
    selectBranch
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
