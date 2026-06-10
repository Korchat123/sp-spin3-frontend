I need to connect the customer menu page to a real backend API instead of hardcoded data.

## Context

Frontend repo: /Users/aj/jsd12/sp-spin3-frontend
Backend API URL will come from: import.meta.env.VITE_API_URL
API endpoint for menus: GET /api/menus
src/utils/api.js already exists and exports { api }

## Fix 1 — Update ShopProvider.jsx

File: /Users/aj/jsd12/sp-spin3-frontend/src/context/ShopProvider.jsx

Read the file first.

Make these changes:

1. Remove this import at the top:
import { MENU } from "../assets/menuData";

2. Add this import at the top:
import { api } from "../utils/api";

3. After the selectedBranch state, add a new menus state:
const [menus, setMenus] = useState([]);
const [menusLoading, setMenusLoading] = useState(true);

4. After the menus state, add a useEffect to fetch menus:
useEffect(() => {
  const fetchMenus = async () => {
    try {
      const data = await api.get('/api/menus')
      setMenus(data)
    } catch (err) {
      console.error('Failed to fetch menus:', err.message)
    } finally {
      setMenusLoading(false)
    }
  }
  fetchMenus()
}, [])

5. In the addToCart function, change:
const menuItem = MENU.find((m) => m.id === id);
to:
const menuItem = menus.find((m) => m._id === id);

6. Add menus and menusLoading to the value object:
menus,
menusLoading,

Do not change anything else in this file.
Show me the full updated file after changes.

## Fix 2 — Update MenuPage.jsx

File: /Users/aj/jsd12/sp-spin3-frontend/src/pages/customer/MenuPage.jsx

Read the file first.

Make these changes:

1. Remove these imports from menuData:
import {
  PROMOTIONS,
  MENU,
  AUTOPLAY_INTERVAL_MS,
  TOAST_DURATION_MS,
} from "../../assets/menuData";

Replace with:
import {
  PROMOTIONS,
  AUTOPLAY_INTERVAL_MS,
  TOAST_DURATION_MS,
} from "../../assets/menuData";

2. Add menus and menusLoading to the useShop destructure:
const {
  cart,
  cartCount,
  addToCart: shopAddToCart,
  updateCartQty,
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
} = useShop();

3. Change this line:
const filteredMenu =
  activeTab === "all" ? MENU : MENU.filter((m) => m.cat === activeTab);

To:
const filteredMenu =
  activeTab === "all" ? menus : menus.filter((m) => m.category === activeTab);

4. In the grid where MenuCard is rendered, add a loading state above the grid:
{menusLoading ? (
  <div className="col-span-full text-center py-20 text-gray-400 font-bold">
    Loading menu...
  </div>
) : filteredMenu.length === 0 ? (
  <div className="col-span-full text-center py-20 text-gray-400 font-bold">
    No items found.
  </div>
) : (
  filteredMenu.map((item) => (
    <MenuCard
      key={item._id}
      item={item}
      onAddToCart={(id, name) =>
        checkBranchBeforeAction("ADD", { id, name })
      }
      onOpenModal={() => checkBranchBeforeAction("VIEW", item)}
    />
  ))
)}

Note: change key={item.id} to key={item._id} and remove the outer map.

Do not change anything else in this file.
Show me the updated filteredMenu line and the updated grid section after changes.

## Fix 3 — Commit and push

cd /Users/aj/jsd12/sp-spin3-frontend
git add src/context/ShopProvider.jsx src/pages/customer/MenuPage.jsx
git commit -m "feat: connect customer menu to real API"
git push origin main

Show me the output of each git command.

## Rules
- Only change what is listed above
- Do not install new packages
- Do not change any other files
- Show exact output for every command
- If any command fails stop and tell me the exact error