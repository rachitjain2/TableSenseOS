import { create } from 'zustand';
import { UserRole } from '../types';

export type CommandTab =
  | 'dashboard'
  | 'executive'
  | 'digital-twin'
  | 'simulation'
  | 'orders'
  | 'kitchen'
  | 'inventory'
  | 'tables'
  | 'staff'
  | 'customers'
  | 'sustainability'
  | 'multi-branch'
  | 'analytics'
  | 'settings';

export type ViewMode = 'command-center' | 'guest-app';

interface UIState {
  viewMode: ViewMode;
  activeTab: CommandTab;
  userRole: UserRole;
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
  isCopilotOpen: boolean;
  activeExplainabilityInsightId: string | null;

  // Staff Preview Session state
  isStaffPreview: boolean;
  previewReturnRoute: CommandTab;
  previewTableNumber: number;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setActiveTab: (tab: CommandTab) => void;
  setUserRole: (role: UserRole) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setCopilotOpen: (isOpen: boolean) => void;
  openExplainabilityDrawer: (insightId: string | null) => void;

  // Staff preview session controls
  enterStaffPreview: (tableNumber?: number, returnRoute?: CommandTab) => void;
  exitStaffPreview: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  viewMode: 'command-center',
  activeTab: 'dashboard',
  userRole: 'owner',
  theme: 'dark',
  isCommandPaletteOpen: false,
  isCopilotOpen: false,
  activeExplainabilityInsightId: null,

  isStaffPreview: false,
  previewReturnRoute: 'dashboard',
  previewTableNumber: 4,

  setViewMode: (mode) => {
    if (mode === 'guest-app') {
      const state = get();
      // If an authenticated staff member clicks guest app mode, initialize preview
      if (state.userRole !== 'guest') {
        set({
          viewMode: 'guest-app',
          isStaffPreview: true,
          previewReturnRoute: state.activeTab,
        });
        return;
      }
    }
    set({ viewMode: mode, isStaffPreview: mode === 'guest-app' && get().isStaffPreview });
  },

  setActiveTab: (tab) => set({ activeTab: tab, viewMode: 'command-center', isStaffPreview: false }),

  setUserRole: (role) => {
    // If switching to kitchen staff, default tab to kitchen display system
    let nextTab: CommandTab = 'dashboard';
    if (role === 'kitchen_staff') nextTab = 'kitchen';
    else if (role === 'waitstaff') nextTab = 'tables';
    else if (role === 'guest') {
      // Genuine guest role switch - clear staff preview session flag
      set({ userRole: role, viewMode: 'guest-app', isStaffPreview: false });
      return;
    }
    set({ userRole: role, activeTab: nextTab, viewMode: 'command-center', isStaffPreview: false });
  },

  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setTheme: (theme) => set({ theme }),
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setCopilotOpen: (isOpen) => set({ isCopilotOpen: isOpen }),
  openExplainabilityDrawer: (insightId) => set({ activeExplainabilityInsightId: insightId }),

  enterStaffPreview: (tableNumber, returnRoute) => {
    const currentState = get();
    // Validate that current user is an authenticated staff role
    if (currentState.userRole === 'guest') {
      return;
    }
    const route = returnRoute || currentState.activeTab;
    const tbl = tableNumber || 4;
    set({
      viewMode: 'guest-app',
      isStaffPreview: true,
      previewReturnRoute: route,
      previewTableNumber: tbl,
    });
  },

  exitStaffPreview: () => {
    const route = get().previewReturnRoute || 'dashboard';
    set({
      viewMode: 'command-center',
      isStaffPreview: false,
      activeTab: route,
    });
  },
}));
