import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useSelectedDataStore = create(
  persist(
    (set) => ({
      data: {},
      updateData: (data) =>
        set((state) => ({
          data: data,
        })),
    }),
    {
      name: "selected-data-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSelectedDataStore;
