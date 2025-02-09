import { basename } from "@tauri-apps/api/path";
import { create } from "zustand";
import { createSelectors } from "./utils";

interface PodcastStoreState {
  path: string | null;
  data: Uint8Array | null;
  hash: string | null;
  fileName: string;
}

const initialState = {
  path: null,
  data: null,
  hash: null,
  fileName: "",
} satisfies PodcastStoreState;

interface PodcastStoreActions {
  updatePath: (path: string) => void;
  updateData: (data: Uint8Array) => void;
  updateHash: (hash: string) => void;

  reset: () => void;
}

export const usePodcastStore = create<
  PodcastStoreState & PodcastStoreActions
>()((set) => ({
  ...initialState,
  updatePath: (path) => {
    set(() => ({ path }));
    basename(path).then((name) => {
      set(() => ({ fileName: name }));
    });
  },
  updateData: (data) => {
    set(() => ({ data }));
  },
  updateHash: (hash) => {
    set(() => ({ hash }));
  },

  reset: () => {
    set(initialState);
  },
}));

export const podcastStoreSelectors = createSelectors(usePodcastStore);
