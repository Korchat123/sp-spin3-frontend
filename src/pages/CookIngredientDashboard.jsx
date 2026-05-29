import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CheckCircle,
  ClipboardList,
  Plus,
  RefreshCcw,
  Save,
  Search,
} from "lucide-react";
import { api } from "../utils/api";

const emptyIngredientForm = {
  name: "",
  quantity: 0,
  unit: "pcs",
  price_per_unit: 0,
  low_stock_threshold: 0,
};

const getIngredientStatus = (ingredient) => {
  if (Number(ingredient.quantity || 0) <= 0) return "out";
  if (Number(ingredient.quantity || 0) < Number(ingredient.low_stock_threshold || 0)) {
    return "low";
  }
  return "ready";
};

const recipeEntryToForm = (entry) => ({
  ingredient: entry.ingredient?._id || entry.ingredient || "",
  quantity: Number(entry.quantity || 1),
});

export default function CookIngredientDashboard() {
  const [ingredients, setIngredients] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [recipeForm, setRecipeForm] = useState([]);
  const [ingredientForm, setIngredientForm] = useState(emptyIngredientForm);
  const [stockDrafts, setStockDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStockId, setSavingStockId] = useState("");
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [message, setMessage] = useState("");

  const selectedMenu = menus.find((menu) => menu._id === selectedMenuId);

  const fetchData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [ingredientData, menuData] = await Promise.all([
        api.get("/ingredients"),
        api.get("/menus?all=true"),
      ]);
      const nextIngredients = Array.isArray(ingredientData) ? ingredientData : [];
      const nextMenus = Array.isArray(menuData) ? menuData : [];
      setIngredients(nextIngredients);
      setMenus(nextMenus);
      setStockDrafts(
        nextIngredients.reduce((drafts, item) => {
          drafts[item._id] = item.quantity;
          return drafts;
        }, {}),
      );
      if (!selectedMenuId && nextMenus[0]) {
        setSelectedMenuId(nextMenus[0]._id);
        setRecipeForm((nextMenus[0].ingredients || []).map(recipeEntryToForm));
      }
    } catch (err) {
      setMessage(err.message || "Unable to load ingredient dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedMenu) return;
    setRecipeForm((selectedMenu.ingredients || []).map(recipeEntryToForm));
  }, [selectedMenuId]);

  const stats = useMemo(() => {
    return ingredients.reduce(
      (current, ingredient) => {
        const status = getIngredientStatus(ingredient);
        current[status] += 1;
        return current;
      },
      { ready: 0, low: 0, out: 0 },
    );
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return ingredients;
    return ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(keyword),
    );
  }, [ingredients, search]);

  const updateStock = async (ingredientId) => {
    setSavingStockId(ingredientId);
    setMessage("");
    try {
      const quantity = Number(stockDrafts[ingredientId] || 0);
      await api.put(`/ingredients/${ingredientId}/stock`, { quantity });
      await fetchData();
      setMessage("Stock updated.");
    } catch (err) {
      setMessage(err.message || "Unable to update stock.");
    } finally {
      setSavingStockId("");
    }
  };

  const createIngredient = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await api.post("/ingredients", {
        ...ingredientForm,
        quantity: Number(ingredientForm.quantity || 0),
        price_per_unit: Number(ingredientForm.price_per_unit || 0),
        low_stock_threshold: Number(ingredientForm.low_stock_threshold || 0),
      });
      setIngredientForm(emptyIngredientForm);
      await fetchData();
      setMessage("Ingredient created.");
    } catch (err) {
      setMessage(err.message || "Unable to create ingredient.");
    }
  };

  const addRecipeRow = () => {
    setRecipeForm((current) => [
      ...current,
      { ingredient: ingredients[0]?._id || "", quantity: 1 },
    ]);
  };

  const updateRecipeRow = (index, field, value) => {
    setRecipeForm((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: field === "quantity" ? Number(value) : value }
          : row,
      ),
    );
  };

  const removeRecipeRow = (index) => {
    setRecipeForm((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const saveRecipe = async () => {
    if (!selectedMenu) return;
    setSavingRecipe(true);
    setMessage("");
    try {
      await api.patch(`/menus/${selectedMenu._id}/ingredients`, {
        ingredients: recipeForm.filter((row) => row.ingredient),
      });
      await fetchData();
      setMessage("Menu ingredients saved.");
    } catch (err) {
      setMessage(err.message || "Unable to save menu ingredients.");
    } finally {
      setSavingRecipe(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-8 font-['IBM_Plex_Sans_Thai'] text-slate-900">
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#e4002b] p-3 text-white shadow-lg shadow-red-100">
            <Boxes size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">INGREDIENT DASHBOARD</h1>
            <p className="font-medium text-slate-500">Control stock and menu recipes for the kitchen.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchData}
            className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 font-bold text-slate-600 transition-colors hover:border-[#e4002b] hover:text-[#e4002b]"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
          <Link
            to="/cookBoard"
            className="flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-5 font-bold text-white transition-colors hover:bg-[#e4002b]"
          >
            <ArrowLeft size={18} />
            Orders
          </Link>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
          {message}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="text-sm font-black uppercase text-green-700">Ready</div>
          <div className="mt-2 text-4xl font-black text-green-700">{stats.ready}</div>
        </div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="text-sm font-black uppercase text-yellow-700">Low Stock</div>
          <div className="mt-2 text-4xl font-black text-yellow-700">{stats.low}</div>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="text-sm font-black uppercase text-red-700">Out Of Stock</div>
          <div className="mt-2 text-4xl font-black text-red-700">{stats.out}</div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center font-black text-slate-400">LOADING INGREDIENTS...</div>
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black">Stock Control</h2>
                <p className="text-sm font-medium text-slate-500">Set quantity to 0 to make connected menu items sold out.</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <Search size={18} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ingredient"
                  className="w-full bg-transparent text-sm font-bold outline-none md:w-56"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2">Ingredient</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Threshold</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient) => {
                    const status = getIngredientStatus(ingredient);
                    const statusStyle =
                      status === "out"
                        ? "bg-red-100 text-red-700"
                        : status === "low"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700";
                    return (
                      <tr key={ingredient._id} className="bg-slate-50">
                        <td className="rounded-l-xl px-3 py-3">
                          <div className="font-black">{ingredient.name}</div>
                          <div className="text-xs font-bold text-slate-400">{ingredient.unit}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black uppercase ${statusStyle}`}>
                            {status === "ready" ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                            {status === "out" ? "Out" : status === "low" ? "Low" : "Ready"}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm font-bold text-slate-600">
                          {ingredient.low_stock_threshold} {ingredient.unit}
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            min="0"
                            value={stockDrafts[ingredient._id] ?? 0}
                            onChange={(event) =>
                              setStockDrafts((current) => ({
                                ...current,
                                [ingredient._id]: event.target.value,
                              }))
                            }
                            className="w-28 rounded-lg border border-slate-200 px-3 py-2 font-bold outline-none focus:border-[#e4002b]"
                          />
                        </td>
                        <td className="rounded-r-xl px-3 py-3 text-right">
                          <button
                            onClick={() => updateStock(ingredient._id)}
                            disabled={savingStockId === ingredient._id}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-black text-white transition-colors hover:bg-[#e4002b] disabled:cursor-wait disabled:opacity-60"
                          >
                            <Save size={15} />
                            {savingStockId === ingredient._id ? "Saving" : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList size={20} className="text-[#e4002b]" />
                <h2 className="text-xl font-black">Menu Ingredients</h2>
              </div>
              <select
                value={selectedMenuId}
                onChange={(event) => setSelectedMenuId(event.target.value)}
                className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#e4002b]"
              >
                {menus.map((menu) => (
                  <option key={menu._id} value={menu._id}>
                    {menu.name}
                  </option>
                ))}
              </select>

              {selectedMenu && (
                <div className={`mb-4 rounded-xl border px-3 py-2 text-sm font-black ${
                  selectedMenu.soldOut
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700"
                }`}>
                  {selectedMenu.soldOut ? "SOLD OUT ON CUSTOMER MENU" : "AVAILABLE ON CUSTOMER MENU"}
                </div>
              )}

              <div className="space-y-3">
                {recipeForm.map((row, index) => (
                  <div key={`${row.ingredient}-${index}`} className="grid grid-cols-[minmax(0,1fr)_86px_34px] gap-2">
                    <select
                      value={row.ingredient}
                      onChange={(event) => updateRecipeRow(index, "ingredient", event.target.value)}
                      className="min-w-0 rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold outline-none focus:border-[#e4002b]"
                    >
                      {ingredients.map((ingredient) => (
                        <option key={ingredient._id} value={ingredient._id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={row.quantity}
                      onChange={(event) => updateRecipeRow(index, "quantity", event.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold outline-none focus:border-[#e4002b]"
                    />
                    <button
                      onClick={() => removeRecipeRow(index)}
                      className="rounded-lg bg-slate-100 font-black text-slate-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove ingredient"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={addRecipeRow}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 font-black text-slate-600 hover:border-[#e4002b] hover:text-[#e4002b]"
                >
                  <Plus size={17} />
                  Add Row
                </button>
                <button
                  onClick={saveRecipe}
                  disabled={savingRecipe || !selectedMenu}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e4002b] px-3 py-3 font-black text-white hover:bg-slate-900 disabled:cursor-wait disabled:opacity-60"
                >
                  <Save size={17} />
                  {savingRecipe ? "Saving" : "Save Recipe"}
                </button>
              </div>
            </section>

            <form onSubmit={createIngredient} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-black">Create Ingredient</h2>
              <div className="space-y-3">
                <input
                  value={ingredientForm.name}
                  onChange={(event) => setIngredientForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#e4002b]"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    value={ingredientForm.quantity}
                    onChange={(event) => setIngredientForm((current) => ({ ...current, quantity: event.target.value }))}
                    placeholder="Quantity"
                    className="rounded-xl border border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#e4002b]"
                  />
                  <input
                    value={ingredientForm.unit}
                    onChange={(event) => setIngredientForm((current) => ({ ...current, unit: event.target.value }))}
                    placeholder="Unit"
                    className="rounded-xl border border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#e4002b]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    value={ingredientForm.price_per_unit}
                    onChange={(event) => setIngredientForm((current) => ({ ...current, price_per_unit: event.target.value }))}
                    placeholder="Price/unit"
                    className="rounded-xl border border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#e4002b]"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    value={ingredientForm.low_stock_threshold}
                    onChange={(event) => setIngredientForm((current) => ({ ...current, low_stock_threshold: event.target.value }))}
                    placeholder="Low threshold"
                    className="rounded-xl border border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#e4002b]"
                  />
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-3 font-black text-white hover:bg-[#e4002b]">
                  <Plus size={17} />
                  Create
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
