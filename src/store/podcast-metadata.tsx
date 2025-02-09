import { create } from "zustand";
import { createSelectors } from "./utils";

interface PodcastMetadataStoreState {
  title: string;
  comment: string;
  album: string;
  genre: string;
  year: string;
}

const initialState = {
  title: "",
  comment: "",
  album: "",
  genre: "",
  year: "",
} satisfies PodcastMetadataStoreState;

interface PodcastMetadataStoreActions {
  updateMetadata: (metadata: PodcastMetadataStoreState) => void;

  updateTitle: (title: string) => void;
  updateComment: (comment: string) => void;
  updateAlbum: (album: string) => void;
  updateGenre: (genres: string) => void;
  updateYear: (year: number) => void;

  reset: () => void;
}

export const usePodcastMetadataStore = create<
  PodcastMetadataStoreState & PodcastMetadataStoreActions
>()((set) => ({
  ...initialState,
  updateMetadata: (metadata) => {
    set(() => metadata);
  },
  updateTitle: (title) => {
    set(() => ({ title }));
  },
  updateComment: (comment) => {
    set(() => ({ comment }));
  },
  updateAlbum: (album) => {
    set(() => ({ album }));
  },
  updateGenre: (genre) => {
    set(() => ({ genre }));
  },
  updateYear: (year) => {
    set(() => ({ year: `${year}` }));
  },

  reset: () => {
    set(initialState);
  },
}));

export const podcastMetadataStoreSelectors = createSelectors(
  usePodcastMetadataStore,
);
