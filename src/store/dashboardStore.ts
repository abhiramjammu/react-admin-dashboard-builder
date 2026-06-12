// v3 - Store only exports the hook, types are in ./types
import { create } from 'zustand';
import type { WidgetType, WidgetData, DashboardLayouts, Layout, SavedLayout } from './types';

export type { WidgetType, WidgetData, DashboardLayouts, Layout, SavedLayout };

const generateId = () => `w_${Math.random().toString(36).substr(2, 9)}`;

const defaultWidgets: WidgetData[] = [
  { i: 'widget_1', type: 'stats', title: 'Total Revenue' },
  { i: 'widget_2', type: 'chart', title: 'User Growth' },
  { i: 'widget_3', type: 'table', title: 'Recent Users' },
];

const defaultLayouts: DashboardLayouts = {
  lg: [
    { i: 'widget_1', x: 0, y: 0, w: 4, h: 5 },
    { i: 'widget_2', x: 4, y: 0, w: 8, h: 9 },
    { i: 'widget_3', x: 0, y: 5, w: 4, h: 7 },
  ],
};

interface DashboardState {
  userId: string | null;
  userName: string | null;
  setUserId: (id: string | null, name?: string) => void;
  layouts: DashboardLayouts;
  widgets: WidgetData[];
  savedLayouts: SavedLayout[];
  addWidget: (type: WidgetType, options?: Partial<WidgetData>) => void;
  removeWidget: (id: string) => void;
  updateLayouts: (layouts: DashboardLayouts) => void;
  saveCurrentLayout: (name: string) => void;
  loadSavedLayout: (id: string) => void;
  deleteSavedLayout: (id: string) => void;
  loadUserData: () => void;
  persistUserData: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  userId: null,
  userName: null,
  setUserId: (id, name) => set({ userId: id, userName: name ?? null }),

  layouts: defaultLayouts,
  widgets: defaultWidgets,
  savedLayouts: [],

  addWidget: (type, options = {}) => {
    const i = generateId();
    const titles: Record<WidgetType, string> = {
      stats: 'Stats Card', chart: 'Area Chart', table: 'Data Table', custom: 'Custom Widget',
    };
    const newWidget: WidgetData = {
      i,
      type,
      title: options.title || titles[type],
      ...options,
    };
    const sizes: Record<WidgetType, { w: number; h: number }> = {
      stats: { w: 4, h: 5 },
      chart: { w: 7, h: 9 },
      table: { w: 7, h: 9 },
      custom: { w: 4, h: 5 },
    };
    const lgLayouts = get().layouts.lg || [];
    const maxY = lgLayouts.length > 0 ? Math.max(...lgLayouts.map((l: Layout) => l.y + l.h)) : 0;
    const newItem: Layout = { i, x: 0, y: maxY, ...sizes[type], minW: 2, minH: 3 };

    set((state) => ({
      widgets: [...state.widgets, newWidget],
      layouts: { ...state.layouts, lg: [...(state.layouts.lg || []), newItem] },
    }));
    setTimeout(() => get().persistUserData(), 0);
  },

  removeWidget: (id) => {
    set((state) => {
      const newLayouts = { ...state.layouts };
      Object.keys(newLayouts).forEach((k) => {
        newLayouts[k] = newLayouts[k].filter((l: Layout) => l.i !== id);
      });
      return { widgets: state.widgets.filter((w) => w.i !== id), layouts: newLayouts };
    });
    setTimeout(() => get().persistUserData(), 0);
  },

  updateLayouts: (layouts) => {
    set({ layouts });
    setTimeout(() => get().persistUserData(), 300);
  },

  saveCurrentLayout: (name) => {
    const { layouts, widgets, savedLayouts, userId } = get();
    if (!userId) return;
    const others = savedLayouts.filter((s) => s.name !== name).slice(-4);
    const entry: SavedLayout = {
      id: generateId(),
      name,
      layouts: JSON.parse(JSON.stringify(layouts)),
      widgets: JSON.parse(JSON.stringify(widgets)),
      createdAt: new Date().toISOString(),
    };
    const updated = [...others, entry];
    set({ savedLayouts: updated });
    localStorage.setItem(`saved_layouts_${userId}`, JSON.stringify(updated));
  },

  loadSavedLayout: (id) => {
    const found = get().savedLayouts.find((s) => s.id === id);
    if (found) {
      set({
        layouts: JSON.parse(JSON.stringify(found.layouts)),
        widgets: JSON.parse(JSON.stringify(found.widgets)),
      });
    }
  },

  deleteSavedLayout: (id) => {
    const { userId } = get();
    set((state) => {
      const updated = state.savedLayouts.filter((s) => s.id !== id);
      if (userId) localStorage.setItem(`saved_layouts_${userId}`, JSON.stringify(updated));
      return { savedLayouts: updated };
    });
  },

  persistUserData: () => {
    const { layouts, widgets, userId } = get();
    if (!userId) return;
    localStorage.setItem(`dashboard_layouts_${userId}`, JSON.stringify(layouts));
    localStorage.setItem(`dashboard_widgets_${userId}`, JSON.stringify(widgets));
  },

  loadUserData: () => {
    const { userId } = get();
    if (!userId) return;
    const savedLayouts = localStorage.getItem(`dashboard_layouts_${userId}`);
    const savedWidgets = localStorage.getItem(`dashboard_widgets_${userId}`);
    const savedLayoutsList = localStorage.getItem(`saved_layouts_${userId}`);
    set({
      layouts: savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts,
      widgets: savedWidgets ? JSON.parse(savedWidgets) : defaultWidgets,
      savedLayouts: savedLayoutsList ? JSON.parse(savedLayoutsList) : [],
    });
  },
}));
