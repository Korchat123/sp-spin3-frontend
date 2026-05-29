import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { api } from "../utils/api";

// eslint-disable-next-line react-refresh/only-export-components
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

  const [menus, setMenus] = useState([]);
  const [menusLoading, setMenusLoading] = useState(true);

  const normalizeMenuItem = (item) => ({
    ...item,
    id: item._id,
    img: item.image || item.img || "",
    desc: item.description || item.desc || "",
    fullDesc: item.description || item.fullDesc || item.desc || "",
    cat: item.category,
    ingredients: Array.isArray(item.ingredients)
      ? item.ingredients.map((entry) => entry.ingredient?.name || entry.name || entry)
      : [],
    soldOut: item.soldOut === true,
  });

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await api.get('/menus')
        setMenus(Array.isArray(data) ? data.map(normalizeMenuItem) : [])
      } catch (err) {
        console.error('Failed to fetch menus:', err.message)
      } finally {
        setMenusLoading(false)
      }
    }
    fetchMenus()
  }, [])

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
      const menuItem = menus.find((m) => m._id === id);
      if (!menuItem) {
        console.warn(`Menu item with id ${id} not found`);
        return prev;
      }
      if (menuItem.soldOut) {
        showToast(`${menuItem.name} is sold out`);
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
          image: menuItem.img,
          qty,
        },
      ];
    });
  };

  const addCartItemDirect = (item) => {
    if (!item?.id) return;

    setCart((prev) => {
      const qty = Number(item.qty || item.quantity || 1);
      const existing = prev.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + qty }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price || 0,
          img: item.img || item.image || "",
          image: item.image || item.img || "",
          qty,
        },
      ];
    });
  };

  const reorderItems = (items = []) => {
    let addedCount = 0;

    items.forEach((item) => {
      const id = item.menu_id || item.menuId || item.id;
      if (!id) return;

      const menuItem = menus.find((menu) => menu._id === id || menu.id === id);
      if (menuItem?.soldOut) return;

      addCartItemDirect({
        id,
        name: menuItem?.name || item.name || "Menu item",
        price: menuItem?.price ?? item.price ?? item.price_at_purchase ?? 0,
        img: menuItem?.img || item.image || "",
        image: menuItem?.image || menuItem?.img || item.image || "",
        qty: item.quantity || item.qty || 1,
      });
      addedCount += 1;
    });

    if (addedCount > 0) {
      showToast(`Added ${addedCount} item${addedCount > 1 ? "s" : ""} from order history`);
    } else {
      showToast("No available items to reorder");
    }

    return addedCount;
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
    reorderItems,
    isCartOpen,
    setIsCartOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    toastMsg,
    showToast,
    selectedBranch,
    selectBranch,
    menus,
    menusLoading,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
