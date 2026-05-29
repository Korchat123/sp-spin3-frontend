import { api } from "../utils/api";

export const accountService = {
  getProfile: () => api.get("/auth/me"),
  updateProfile: (profile) => api.patch("/auth/me", profile),
  changePassword: (passwords) => api.patch("/auth/change-password", passwords),
};
