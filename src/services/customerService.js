import { api } from "../utils/api";

export const customerService = {
  getIndex: () => api.get("/customer/index"),
  getMenus: (category) => {
    const query = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
    return api.get(`/customer/menus${query}`);
  },
};
