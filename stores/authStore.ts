import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: {},
      access_token: "",
      isAuthenticated: false,
      login: (data) =>
        set((state) => ({
          user: data.user,
          access_token: data.access_token,
          isAuthenticated: true,
        })),
      logout: () =>
        set((state) => ({
          user: {},
          access_token: "",
          isAuthenticated: false,
        })),
      updateUser: (data) =>
        set((state) => ({
          user: data,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
