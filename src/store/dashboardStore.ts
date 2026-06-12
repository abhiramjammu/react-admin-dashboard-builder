// v3 - Store only exports the hook, types are in ./types
import { create } from 'zustand';
import type { WidgetType, WidgetData, DashboardLayouts, Layout, SavedLayout } from './types';

export type { WidgetType, WidgetData, DashboardLayouts, Layout, SavedLayout };

export const WIDGET_SIZES: Record<WidgetType, { w: number; h: number }> = {
  stats: { w: 3, h: 2 },
  chart: { w: 3, h: 3 },
  table: { w: 4, h: 3 },
  custom: { w: 3, h: 2 },
};

const generateId = () => `w_${Math.random().toString(36).substr(2, 9)}`;

const defaultWidgets: WidgetData[] = [
  { i: 'widget_1', type: 'stats', title: 'Total Revenue' },
  { i: 'widget_2', type: 'chart', title: 'User Growth' },
  { i: 'widget_3', type: 'table', title: 'Recent Users' },
];

const defaultLayouts: DashboardLayouts = {
  lg: [
    { i: 'widget_1', x: 0, y: 0, w: 3, h: 2 },
    { i: 'widget_2', x: 0, y: 2, w: 3, h: 3 },
    { i: 'widget_3', x: 3, y: 2, w: 4, h: 3 },
  ],
};

interface DashboardState {
  userId: string | null;
  userName: string | null;
  setUserId: (id: string | null, name?: string) => void;
  layouts: DashboardLayouts;
  widgets: WidgetData[];
  savedLayouts: SavedLayout[];
  addWidget: (type: WidgetType, options?: Partial<WidgetData>, x?: number, y?: number) => void;
  removeWidget: (id: string) => void;
  updateLayouts: (layouts: DashboardLayouts) => void;
  updateWidget: (id: string, data: Partial<WidgetData>) => void;
  saveCurrentLayout: (name: string) => void;
  loadSavedLayout: (id: string) => void;
  deleteSavedLayout: (id: string) => void;
  loadUserData: () => void;
  persistUserData: () => void;
  draggingType: WidgetType | null;
  setDraggingType: (type: WidgetType | null) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  userId: null,
  userName: null,
  setUserId: (id, name) => set({ userId: id, userName: name ?? null }),

  layouts: defaultLayouts,
  widgets: defaultWidgets,
  savedLayouts: [],
  draggingType: null,
  setDraggingType: (type) => set({ draggingType: type }),

  addWidget: (type, options = {}, x, y) => {
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
    const lgLayouts = get().layouts?.lg || [];
    let finalX = x;
    let finalY = y;
    const w = WIDGET_SIZES[type].w;
    const h = WIDGET_SIZES[type].h;

    if (x === undefined || y === undefined) {
      const grid: boolean[][] = [];
      let maxY = 0;
      lgLayouts.forEach(l => {
        maxY = Math.max(maxY, l.y + l.h);
        for (let dy = 0; dy < l.h; dy++) {
          if (!grid[l.y + dy]) grid[l.y + dy] = [];
          for (let dx = 0; dx < l.w; dx++) {
            grid[l.y + dy][l.x + dx] = true;
          }
        }
      });
      let found = false;
      for (let sy = 0; sy <= maxY; sy++) {
        for (let sx = 0; sx <= 12 - w; sx++) {
          let canFit = true;
          for (let dx = 0; dx < w; dx++) {
            if (grid[sy] && grid[sy][sx + dx]) {
              canFit = false; 
              break;
            }
          }
          if (canFit) {
            finalX = sx;
            finalY = sy;
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        finalX = 0;
        finalY = maxY;
      }
    }

    const newItem: Layout = { 
      i, 
      x: finalX as number, 
      y: finalY as number, 
      ...WIDGET_SIZES[type], 
      minW: 2, 
      minH: 2 
    };

    set((state) => ({
      widgets: [...(state.widgets || []), newWidget],
      layouts: { ...(state.layouts || {}), lg: [...(state.layouts?.lg || []), newItem] },
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
    if (!layouts) return;
    set({ layouts });
    setTimeout(() => get().persistUserData(), 300);
  },

  updateWidget: (id, data) => {
    set((state) => ({
      widgets: state.widgets.map(w => w.i === id ? { ...w, ...data } : w)
    }));
    setTimeout(() => get().persistUserData(), 0);
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
    localStorage.setItem(`saved_layouts_v8_${userId}`, JSON.stringify(updated));
  },

  loadSavedLayout: (id) => {
    const found = get().savedLayouts.find((s) => s.id === id);
    if (found) {
      set({
        layouts: JSON.parse(JSON.stringify(found.layouts)),
        widgets: JSON.parse(JSON.stringify(found.widgets)),
      });
      setTimeout(() => get().persistUserData(), 0);
    }
  },

  deleteSavedLayout: (id) => {
    const { userId } = get();
    set((state) => {
      const updated = state.savedLayouts.filter((s) => s.id !== id);
      if (userId) localStorage.setItem(`saved_layouts_v8_${userId}`, JSON.stringify(updated));
      return { savedLayouts: updated };
    });
  },

  persistUserData: () => {
    const { layouts, widgets, userId } = get();
    if (!userId) return;
    localStorage.setItem(`dashboard_layouts_v8_${userId}`, JSON.stringify(layouts));
    localStorage.setItem(`dashboard_widgets_v8_${userId}`, JSON.stringify(widgets));
  },

  loadUserData: () => {
    const { userId } = get();
    if (!userId) return;
    
    const safeParse = (key: string, defaultVal: any) => {
      try {
        const item = localStorage.getItem(key);
        if (item && item !== 'undefined' && item !== 'null') {
          return JSON.parse(item);
        }
      } catch (e) {
        console.warn('Failed to parse localStorage for', key);
      }
      return defaultVal;
    };

    let loadedLayouts = safeParse(`dashboard_layouts_v8_${userId}`, defaultLayouts);
    const loadedWidgets = safeParse(`dashboard_widgets_v8_${userId}`, defaultWidgets);
    
    // Auto-fix any squished cached layouts from previous versions or corrupted array formats
    if (Array.isArray(loadedLayouts)) {
      // If it was saved as a flat array, migrate it to the correct breakpoint format
      loadedLayouts = { lg: loadedLayouts };
    }
    
    if (!loadedLayouts || typeof loadedLayouts !== 'object' || !loadedLayouts.lg) {
      loadedLayouts = defaultLayouts;
    }

    if (loadedLayouts.lg) {
      loadedLayouts.lg = loadedLayouts.lg.map((l: Layout) => {
        const wType = loadedWidgets.find((w: WidgetData) => w.i === l.i)?.type || 'custom';
        const sizes = WIDGET_SIZES[wType];
        return {
          ...l,
          w: l.w || sizes.w,
          h: l.h || sizes.h,
          minW: 2,
          minH: 2
        };
      });
    }

    set({
      layouts: loadedLayouts,
      widgets: loadedWidgets,
      savedLayouts: safeParse(`saved_layouts_v8_${userId}`, []),
    });
  },
}));
