export const createShowSideBarSlice = (set, get) => ({
  showSideBar: false,
  setShowSideBar: (e) => set((state) => ({ showSideBar: e })),
});
