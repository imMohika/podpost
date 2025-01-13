import { IAudioMetadata } from "music-metadata";
import { create } from "zustand";
import { createSelectors } from "./utils";
import { basename } from "@tauri-apps/api/path";

interface PodcastStoreState {
  path: string | null;
  data: Uint8Array | null;
  hash: string | null;
  metadata: IAudioMetadata | null;
  fileName: string;
  title: string;
}

const initialState = {
  path: null,
  data: null,
  hash: null,
  metadata: null,
  fileName: "",
  title: "",
} satisfies PodcastStoreState;

interface PodcastStoreActions {
  updatePath: (path: string) => void;
  updateData: (data: Uint8Array) => void;
  updateHash: (hash: string) => void;
  updateMetadata: (metadata: IAudioMetadata) => void;
  updateTitle: (title: string) => void;
  reset: () => void;
}

export const usePodcastStore = create<
  PodcastStoreState & PodcastStoreActions
>()((set) => ({
  ...initialState,
  updatePath: (path: string) => {
    console.log("new path", { path });
    set(() => ({ path }));
    basename(path).then((name) => {
      set(() => ({ fileName: name }));
    });
  },
  updateData: (data: Uint8Array) => {
    console.log("new data", { data });
    set(() => ({ data }));
  },
  updateHash: (hash: string) => {
    console.log("new hash", { hash });
    set(() => ({ hash }));
  },
  updateMetadata: (metadata: IAudioMetadata) => {
    console.log("new metadata", { metadata });
    set(() => ({ metadata }));
  },
  updateTitle: (title: string) => {
    console.log("new title", { title });
    set(() => ({ title }));
  },
  reset: () => {
    set(initialState);
  },
}));

export const podcastStoreSelectors = createSelectors(usePodcastStore);
