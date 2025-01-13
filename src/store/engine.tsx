import { create } from "zustand";
import { LazyStore } from "@tauri-apps/plugin-store";
import { createSelectors } from "./utils";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { EngineType } from "@/sdk/constants";

const persistedStore = new LazyStore("engine.json");
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return (await persistedStore.get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await await persistedStore.set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await await persistedStore.delete(name);
  },
};

interface EngineStoreState {
  engine: EngineType;
  apiBase: string;
}

const toPersist = ["apiBase"];

const initialState = {
  engine: "whisperx",
  apiBase: "http://localhost:8000",
} satisfies EngineStoreState;

interface EngineStoreActions {
  updateApiBase: (base: string) => void;
  reset: () => void;
}

export const useEngineStore = create<EngineStoreState & EngineStoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateApiBase: (base: string) => {
        set({ apiBase: base });
      },
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "engine-storage",
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => toPersist.includes(key))
        ),
      storage: createJSONStorage(() => storage),
    }
  )
);

export const engineStoreSelectors = createSelectors(useEngineStore);
