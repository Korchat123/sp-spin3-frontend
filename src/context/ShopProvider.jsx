import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { api } from "../utils/api";

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const getApiBaseUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const isLocalApiUrl = (url) => {
  try {
    return ["localhost", "127.0.0.1"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
};

const isBrowserOnLocalhost = () =>
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const getMenuStreamUrl = () => {
  const apiUrl = getApiBaseUrl();
  if (!isBrowserOnLocalhost() && isLocalApiUrl(apiUrl)) return "";

  try {
    const url = new URL(apiUrl);
    url.pathname = `${url.pathname.replace(/\/$/, "")}/menus/stream`;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
};

export const ShopProvider = ({ children }) => {
  // --- Cart State ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("crispyCart");
    if (!savedCart) return [];

    try {
      const parsedCart = JSON.parse(savedCart);
      if (!Array.isArray(parsedCart)) return [];

      return parsedCart.map((item) => {
        const qty = Math.max(1, Number(item.qty || item.quantity || 1));
        return { ...item, qty, quantity: qty };
      });
    } catch {
      return [];
    }
  });

  // --- UI Global State ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [selectedOrderType, setSelectedOrderTypeState] = useState(() => {
    const savedType = localStorage.getItem("selectedOrderType");
    return ["delivery", "pickup", "reserve"].includes(savedType)
      ? savedType
      : "delivery";
  });
  
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

    // --- SSE Real-time Updates ---
    const streamUrl = getMenuStreamUrl()
    if (!streamUrl) return undefined

    const eventSource = new EventSource(streamUrl)

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === 'menu:update') {
          console.log('Menu update received via SSE')
          setMenus(Array.isArray(payload.menus) ? payload.menus.map(normalizeMenuItem) : [])
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err)
      }
    }

    eventSource.onerror = (err) => {
      console.warn('Menu SSE unavailable; using normal API refresh only.', err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("crispyCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // Derived state
  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.qty || item.quantity || 0), 0), 
  [cart]);

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const qty = Math.max(0, (item.qty || item.quantity || 0) + delta);
            return { ...item, qty, quantity: qty };
          }
          return item;
        })
        .filter((item) => (item.qty || item.quantity || 0) > 0)
    );
  };

  const addToCart = (id, qty = 1) => {
    setCart((prev) => {
      const itemQty = Math.max(1, Number(qty || 1));
      const menuItem = menus.find((m) => m._id === id || m.id === id);
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
          item.id === id
            ? {
                ...item,
                qty: (item.qty || item.quantity || 0) + itemQty,
                quantity: (item.qty || item.quantity || 0) + itemQty,
              }
            : item
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
          qty: itemQty,
          quantity: itemQty,
        },
      ];
    });
  };

  const addCartItemDirect = (item) => {
    if (!item?.id) return;

    setCart((prev) => {
      const qty = Math.max(1, Number(item.qty || item.quantity || 1));
      const existing = prev.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                qty: (cartItem.qty || cartItem.quantity || 0) + qty,
                quantity: (cartItem.qty || cartItem.quantity || 0) + qty,
              }
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
          quantity: qty,
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
        quantity: item.quantity || item.qty || 1,
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

  const setSelectedOrderType = (type) => {
    if (!["delivery", "pickup", "reserve"].includes(type)) return;
    setSelectedOrderTypeState(type);
    localStorage.setItem("selectedOrderType", type);
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
    selectedOrderType,
    setSelectedOrderType,
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
