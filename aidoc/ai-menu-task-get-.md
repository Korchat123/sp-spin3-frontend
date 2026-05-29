You are a senior developer. I need you to fix 3 files in my frontend 
project. Edit the actual files on disk one by one.

========================================================================
TASK 1 — Fix owner app category filter
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/owner-app/src/pages/Menu.jsx

Find this line:
  const categories = ['All', 'Main', 'Side', 'Drink', 'Dessert']

Replace with:
  const categories = ['All', 'chicken', 'burger', 'combo', 'drink', 'side', 'dessert']

========================================================================
TASK 2 — Fix customer app menu data category values
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/src/assets/menuData.js

Update the cat field on every item in the MENU array using 
this exact mapping. Do not change any other field:

  bucket    → chicken
  sandwich  → burger
  desserts  → dessert
  side      → side      (no change)
  drink     → drink     (no change)

========================================================================
TASK 3 — Fix customer app menu page tab filters
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/src/pages/customer/MenuPage.jsx

Find the tab array that looks like this:
  { id: "all",       label: "ALL" },
  { id: "bucket",    label: "BUCKETS" },
  { id: "sandwich",  label: "SANDWICHES" },
  { id: "side",      label: "SIDES" },
  { id: "desserts",  label: "DESSERTS" },
  { id: "drink",     label: "DRINKS" },

Replace with:
  { id: "all",      label: "ALL" },
  { id: "chicken",  label: "CHICKEN" },
  { id: "burger",   label: "BURGERS" },
  { id: "combo",    label: "COMBOS" },
  { id: "side",     label: "SIDES" },
  { id: "dessert",  label: "DESSERTS" },
  { id: "drink",    label: "DRINKS" },

========================================================================
TASK 4 — Fix owner app API menu calls
========================================================================

File: /Users/aj/jsd12/sp-spin3-frontend/owner-app/src/api/menu.js

Find this line:
  export const getMenu = () => api.get('/api/menus')

Replace with:
  export const getMenu = () => api.get('/api/menus?all=true')

Then add these two new functions at the bottom of the file:
  export const createMenu = (data) => api.post('/api/menus', data)
  export const deleteMenu = (id) => api.delete(`/api/menus/${id}`)

========================================================================

After ALL 4 tasks are done:

1. Show me the final content of every file you changed
2. Confirm each task was written to disk successfully
3. Run this command and show me the output:
   cd /Users/aj/jsd12/sp-spin3-frontend && npm run dev
4. Confirm the app starts on port 5173 with no errors