import { engineStoreSelectors } from "@/store/engine";

export const getApiBase = () => {
  return engineStoreSelectors.getState().apiBase;
};
