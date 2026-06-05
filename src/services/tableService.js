import { api } from "../utils/api";

export const tableService = {
  getTables: async () => api.get("/tables"),
  getAvailability: async ({ date, timeSlot, pax }) => {
    const params = new URLSearchParams({
      date,
      timeSlot,
      pax: String(pax),
    });
    return api.get(`/tables/availability?${params.toString()}`);
  },
  createTable: async (tableData) => api.post("/tables", tableData),
  updateTable: async (tableId, tableData) =>
    api.patch(`/tables/${tableId}`, tableData),
};
