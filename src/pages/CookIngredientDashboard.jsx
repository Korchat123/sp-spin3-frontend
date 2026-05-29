import { useCallback, useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Boxes,
  CheckCircle,
  ClipboardList,
  LogOut,
  Plus,
  RefreshCcw,
  Save,
  Search,
} from "lucide-react";
import { api } from "../utils/api";
import { UserContext } from "../context/userContext/UserContext";

const emptyIngredientForm = {
  ingredient_index: "",
  name: "",
  quantity: 0,
  unit: "piece",
  price_per_unit: 0,
  low_stock_threshold: 0,
};

const unitOptions = ["piece", "kg", "g", "liter", "ml"];

const getIngredientSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const url = new URL(apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws/ingredients";
  url.search = "";
  return url.toString();
};

const formatIngredientCode = (ingredient, rowIndex) => {
  const code = Number(ingredient.ingredient_index || 0);
  return code > 0 ? code : rowIndex + 1;
};

const getIngredientStatus = (ingredient) => {
  if (ingredient.active_status === false) return "unused";
  if (Number(ingredient.quantity || 0) <= 0) return "out";
  if (Number(ingredient.quantity || 0) < Number(ingredient.low_stock_threshold || 0)) {
    return "low";
  }
  return "ready";
};

const ingredientStatusPriority = {
  out: 0,
  low: 1,
  ready: 2,
  unused: 3,
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
  const [ingredientDrafts, setIngredientDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingStockId, setSavingStockId] = useState("");
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [message, setMessage] = useState("");
  const { setMyUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const selectedMenu = menus.find((menu) => menu._id === selectedMenuId);

  const applyRealtimeSnapshot = useCallback((ingredientData, menuData) => {
    const nextIngredients = Array.isArray(ingredientData) ? ingredientData : [];
    const nextMenus = Array.isArray(menuData) ? menuData : [];

    setIngredients(nextIngredients);
    setMenus(nextMenus);
    setIngredientDrafts(
      nextIngredients.reduce((drafts, item) => {
        drafts[item._id] = {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          low_stock_threshold: item.low_stock_threshold,
          active_status: item.active_status !== false,
        };
        return drafts;
      }, {}),
    );
    setSelectedMenuId((currentSelectedMenuId) => {
      if (currentSelectedMenuId || !nextMenus[0]) return currentSelectedMenuId;
      setRecipeForm((nextMenus[0].ingredients || []).map(recipeEntryToForm));
      return nextMenus[0]._id;
    });
  }, []);

  const fetchData = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true);
      setMessage("");
    }
    try {
      const [ingredientData, menuData] = await Promise.all([
        api.get("/ingredients"),
        api.get("/menus?all=true"),
      ]);
      applyRealtimeSnapshot(ingredientData, menuData);
    } catch (err) {
      setMessage(err.message || "Unable to load ingredient dashboard.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [applyRealtimeSnapshot]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const socket = new WebSocket(getIngredientSocketUrl());

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "ingredient:snapshot") {
          applyRealtimeSnapshot(payload.ingredients, payload.menus);
          setLoading(false);
        }
        if (payload.type === "error") {
          setMessage(payload.message || "Ingredient realtime connection error.");
        }
      } catch {
        setMessage("Unable to read ingredient realtime update.");
      }
    };

    socket.onerror = () => {
      setMessage("Ingredient realtime connection failed.");
    };

    return () => {
      socket.close();
    };
  }, [applyRealtimeSnapshot]);

  useEffect(() => {
    if (!selectedMenu) return;
    setRecipeForm((selectedMenu.ingredients || []).map(recipeEntryToForm));
  }, [selectedMenu, selectedMenuId]);

  const stats = useMemo(() => {
    return ingredients.reduce(
      (current, ingredient) => {
        const status = getIngredientStatus(ingredient);
        current[status] += 1;
        return current;
      },
      { ready: 0, low: 0, out: 0, unused: 0 },
    );
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return ingredients
      .filter((ingredient) => {
        const matchesSearch = !keyword || ingredient.name.toLowerCase().includes(keyword);
        const status = getIngredientStatus(ingredient);
        const matchesStatus = stockFilter === "all" || status === stockFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const statusSort =
          ingredientStatusPriority[getIngredientStatus(a)] -
          ingredientStatusPriority[getIngredientStatus(b)];
        if (statusSort !== 0) return statusSort;
        const indexSort = Number(a.ingredient_index || 0) - Number(b.ingredient_index || 0);
        if (indexSort !== 0) return indexSort;
        return a.name.localeCompare(b.name);
      });
  }, [ingredients, search, stockFilter]);

  const updateStock = async (ingredientId) => {
    setSavingStockId(ingredientId);
    setMessage("");
    try {
      const draft = ingredientDrafts[ingredientId];
      await api.put(`/ingredients/${ingredientId}`, {
        name: draft.name.trim(),
        quantity: Number(draft.quantity || 0),
        unit: draft.unit.trim(),
        low_stock_threshold: Number(draft.low_stock_threshold || 0),
        active_status: draft.active_status,
      });
      await fetchData();
      setMessage("Ingredient updated.");
    } catch (err) {
      setMessage(err.message || "Unable to update ingredient.");
    } finally {
      setSavingStockId("");
    }
  };

  const updateIngredientDraft = (ingredientId, field, value) => {
    setIngredientDrafts((current) => ({
      ...current,
      [ingredientId]: {
        ...current[ingredientId],
        [field]: value,
      },
    }));
  };

  const createIngredient = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await api.post("/ingredients", {
        ...ingredientForm,
        ingredient_index:
          ingredientForm.ingredient_index === ""
            ? undefined
            : Number(ingredientForm.ingredient_index || 0),
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

  const getIngredientUnit = (ingredientId) => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);
    return ingredientDrafts[ingredientId]?.unit || ingredient?.unit || "-";
  };

  const handleLogout = () => {
    setMyUserInfo(null);
    navigate("/login");
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
    <div className="flex flex-col bg-[#f8fafc] min-h-screen lg:h-screen lg:overflow-hidden font-['IBM_Plex_Sans_Thai'] p-4 lg:p-5">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-3 gap-3 bg-white px-3 py-2.5 lg:px-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-[#e4002b] p-2 rounded-lg text-white shadow-sm shrink-0">
            <Boxes size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none">INGREDIENT DASHBOARD</h1>
            <p className="text-xs font-bold text-slate-500">Stock and recipe control</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/cookBoard")}
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:border-[#e4002b] hover:text-[#e4002b]"
          >
            <ClipboardList size={17} />
            <span>ORDERS</span>
          </button>
          <button
            onClick={fetchData}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#e4002b] hover:text-[#e4002b]"
            title="Refresh ingredients"
            aria-label="Refresh ingredients"
          >
            <RefreshCcw size={17} />
          </button>
          <button
            onClick={handleLogout}
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e4002b]"
          >
            <LogOut size={17} />
            <span>EXIT</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
          {message}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center font-black text-slate-400">LOADING INGREDIENTS...</div>
      ) : (
        <div className="grid flex-1 min-h-0 grid-cols-1 gap-5 overflow-hidden xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <section className="flex min-h-0 max-h-[46vh] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:max-h-none">
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black">Stock Control</h2>
                <p className="text-sm font-medium text-slate-500">Set quantity to 0 to make connected menu items sold out.</p>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "All", count: ingredients.length, className: "border-slate-200 bg-white text-slate-700" },
                    { id: "ready", label: "Ready", count: stats.ready, className: "border-green-200 bg-green-50 text-green-700" },
                    { id: "low", label: "Low", count: stats.low, className: stats.low > 0 ? "border-yellow-500 bg-yellow-400 text-yellow-950" : "border-yellow-300 bg-yellow-50 text-yellow-800", warn: stats.low > 0 },
                    { id: "out", label: "Out", count: stats.out, className: stats.out > 0 ? "border-red-600 bg-red-600 text-white" : "border-red-300 bg-red-50 text-red-700", warn: stats.out > 0 },
                    { id: "unused", label: "Not Used", count: stats.unused, className: "border-slate-300 bg-slate-200 text-slate-700" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStockFilter(item.id)}
                      className={`relative inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-black uppercase transition-colors ${
                        item.className
                      } ${
                        stockFilter === item.id
                          ? "ring-2 ring-[#e4002b] ring-offset-1"
                          : ""
                      }`}
                    >
                      {item.warn && <AlertTriangle size={13} className={item.id === "out" ? "text-white" : "text-yellow-950"} />}
                      <span>{item.label}</span>
                      <span>{item.count}</span>
                    </button>
                  ))}
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
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    <th className="px-2 py-2">Index</th>
                    <th className="px-2 py-2">Ingredient</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Quantity / Unit</th>
                    <th className="px-2 py-2">Minimum</th>
                    <th className="px-2 py-2">Use</th>
                    <th className="px-2 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient, rowIndex) => {
                    const status = getIngredientStatus(ingredient);
                    const draft = ingredientDrafts[ingredient._id] || {
                      name: ingredient.name,
                      quantity: ingredient.quantity,
                      unit: ingredient.unit,
                      low_stock_threshold: ingredient.low_stock_threshold,
                      active_status: ingredient.active_status !== false,
                    };
                    const statusStyle =
                      status === "out"
                        ? "border border-red-700 bg-red-600 text-white"
                        : status === "low"
                          ? "border border-yellow-500 bg-yellow-300 text-yellow-950"
                          : status === "unused"
                            ? "border border-slate-400 bg-slate-200 text-slate-700"
                            : "bg-green-100 text-green-700";
                    const rowStyle =
                      status === "out"
                        ? "bg-red-100 text-red-950"
                        : status === "low"
                          ? "bg-yellow-100 text-yellow-950"
                          : status === "unused"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-slate-50";
                    return (
                      <tr key={ingredient._id} className={rowStyle}>
                        <td className="rounded-l-xl px-2 py-2">
                          <span className="inline-flex min-w-12 justify-center rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm font-black text-slate-700">
                            {formatIngredientCode(ingredient, rowIndex)}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            value={draft.name}
                            onChange={(event) => updateIngredientDraft(ingredient._id, "name", event.target.value)}
                            className="min-w-0 w-36 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-black text-slate-900 outline-none focus:border-[#e4002b]"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black uppercase ${statusStyle}`}>
                            {status === "ready" ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                            {status === "out" ? "Out" : status === "low" ? "Low" : status === "unused" ? "Not Used" : "Ready"}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={draft.quantity}
                              onChange={(event) => updateIngredientDraft(ingredient._id, "quantity", event.target.value)}
                              className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold outline-none focus:border-[#e4002b]"
                            />
                            <select
                              value={draft.unit}
                              onChange={(event) => updateIngredientDraft(ingredient._id, "unit", event.target.value)}
                              className="w-24 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-bold text-slate-900 outline-none focus:border-[#e4002b]"
                            >
                              {unitOptions.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            value={draft.low_stock_threshold}
                            onChange={(event) => updateIngredientDraft(ingredient._id, "low_stock_threshold", event.target.value)}
                            className="w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold outline-none focus:border-[#e4002b]"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <select
                            value={draft.active_status ? "active" : "unused"}
                            onChange={(event) => updateIngredientDraft(ingredient._id, "active_status", event.target.value === "active")}
                            className="w-24 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-black outline-none focus:border-[#e4002b]"
                          >
                            <option value="active">Use</option>
                            <option value="unused">Not Used</option>
                          </select>
                        </td>
                        <td className="rounded-r-xl px-2 py-2 text-right">
                          <button
                            onClick={() => updateStock(ingredient._id)}
                            disabled={savingStockId === ingredient._id}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-2 text-sm font-black text-white transition-colors hover:bg-[#e4002b] disabled:cursor-wait disabled:opacity-60"
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

          <aside className="grid min-h-0 gap-3 pr-1 lg:h-full lg:grid-rows-[minmax(0,1fr)_minmax(250px,0.78fr)]">
            <section className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <ClipboardList size={18} className="text-[#e4002b]" />
                <h2 className="text-lg font-black">Menu Ingredients</h2>
              </div>
              <select
                value={selectedMenuId}
                onChange={(event) => setSelectedMenuId(event.target.value)}
                className="mb-2 w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-[#e4002b]"
              >
                {menus.map((menu) => (
                  <option key={menu._id} value={menu._id}>
                    {menu.name}
                  </option>
                ))}
              </select>

              {selectedMenu && (
                <div className={`mb-2 rounded-lg border px-3 py-1.5 text-xs font-black ${
                  selectedMenu.soldOut
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700"
                }`}>
                  {selectedMenu.soldOut ? "SOLD OUT ON CUSTOMER MENU" : "AVAILABLE ON CUSTOMER MENU"}
                </div>
              )}

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {recipeForm.map((row, index) => (
                  <div key={`${row.ingredient}-${index}`} className="grid grid-cols-[minmax(0,1fr)_64px_72px_34px] gap-2">
                    <select
                      value={row.ingredient}
                      onChange={(event) => updateRecipeRow(index, "ingredient", event.target.value)}
                      className="min-w-0 cursor-pointer rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold outline-none focus:border-[#e4002b]"
                    >
                      {ingredients
                        .filter((ingredient) => ingredient.active_status !== false || ingredient._id === row.ingredient)
                        .map((ingredient) => (
                        <option key={ingredient._id} value={ingredient._id}>
                          {ingredient.name}{ingredient.active_status === false ? " (Not Used)" : ""}
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
                    <span className="flex min-w-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm font-black text-slate-500">
                      {getIngredientUnit(row.ingredient)}
                    </span>
                    <button
                      onClick={() => removeRecipeRow(index)}
                      className="cursor-pointer rounded-lg bg-slate-100 font-black text-slate-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove ingredient"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex shrink-0 gap-2">
                <button
                  onClick={addRecipeRow}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-600 hover:border-[#e4002b] hover:text-[#e4002b]"
                >
                  <Plus size={17} />
                  Add Row
                </button>
                <button
                  onClick={saveRecipe}
                  disabled={savingRecipe || !selectedMenu}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#e4002b] px-3 py-2 text-sm font-black text-white hover:bg-slate-900 disabled:cursor-wait disabled:opacity-60"
                >
                  <Save size={17} />
                  {savingRecipe ? "Saving" : "Save Recipe"}
                </button>
              </div>
            </section>

            <form onSubmit={createIngredient} className="flex min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <h2 className="mb-2 shrink-0 text-lg font-black leading-none">Create Ingredient</h2>
              <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
                <div className="space-y-2">
                <label className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-xs font-black uppercase text-slate-500">Index</span>
                  <input
                    type="number"
                    min="0"
                    value={ingredientForm.ingredient_index}
                    onChange={(event) => setIngredientForm((current) => ({ ...current, ingredient_index: event.target.value }))}
                    placeholder="Index"
                    className="min-w-0 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold outline-none focus:border-[#e4002b]"
                  />
                </label>
                <label className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2">
                  <span className="text-xs font-black uppercase text-slate-500">Name</span>
                  <input
                    value={ingredientForm.name}
                    onChange={(event) => setIngredientForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Name"
                    className="min-w-0 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold outline-none focus:border-[#e4002b]"
                    required
                  />
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[72px_minmax(0,1fr)]">
                    <span className="text-xs font-black uppercase text-slate-500">Quantity</span>
                    <input
                      type="number"
                      min="0"
                      value={ingredientForm.quantity}
                      onChange={(event) => setIngredientForm((current) => ({ ...current, quantity: event.target.value }))}
                      placeholder="Quantity"
                      className="min-w-0 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold outline-none focus:border-[#e4002b]"
                    />
                  </label>
                  <label className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[44px_minmax(0,1fr)]">
                    <span className="text-xs font-black uppercase text-slate-500">Unit</span>
                    <select
                      value={ingredientForm.unit}
                      onChange={(event) => setIngredientForm((current) => ({ ...current, unit: event.target.value }))}
                      className="min-w-0 w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold outline-none focus:border-[#e4002b]"
                      required
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[72px_minmax(0,1fr)]">
                    <span className="text-xs font-black uppercase text-slate-500">Price/unit</span>
                    <input
                      type="number"
                      min="0"
                      value={ingredientForm.price_per_unit}
                      onChange={(event) => setIngredientForm((current) => ({ ...current, price_per_unit: event.target.value }))}
                      placeholder="Price/unit"
                      className="min-w-0 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold outline-none focus:border-[#e4002b]"
                      required
                    />
                  </label>
                  <label className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[72px_minmax(0,1fr)]">
                    <span className="text-xs font-black uppercase text-slate-500">Low</span>
                    <input
                      type="number"
                      min="0"
                      value={ingredientForm.low_stock_threshold}
                      onChange={(event) => setIngredientForm((current) => ({ ...current, low_stock_threshold: event.target.value }))}
                      placeholder="Low threshold"
                      className="min-w-0 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold outline-none focus:border-[#e4002b]"
                    />
                  </label>
                </div>
                </div>
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-black text-white hover:bg-[#e4002b]">
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
