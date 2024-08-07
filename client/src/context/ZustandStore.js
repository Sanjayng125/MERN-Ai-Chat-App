import { create } from "zustand";
import { createShowSideBarSlice } from "./slices/SideBarSlice";

export const useStore = create()((...a) => ({
  ...createShowSideBarSlice(...a),
}));
