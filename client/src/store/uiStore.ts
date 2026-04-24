import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  activeFilters: {
    status: string | undefined;
    priority: string | undefined;
    assigneeId: string | undefined;
    search: string;
    page: number;
  };
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setFilter: (key: string, value: string | number | undefined) => void;
  resetFilters: () => void;
}

const defaultFilters = {
  status: undefined,
  priority: undefined,
  assigneeId: undefined,
  search: '',
  page: 1,
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  activeFilters: { ...defaultFilters },
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [key]: value,
        ...(key !== 'page' ? { page: 1 } : {}),
      },
    })),
  resetFilters: () => set({ activeFilters: { ...defaultFilters } }),
}));
