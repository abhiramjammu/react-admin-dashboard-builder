// All shared types for the dashboard
export type WidgetType = 'chart' | 'stats' | 'table' | 'custom';

export interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface WidgetData {
  i: string;
  type: WidgetType;
  title: string;
  customBg?: string;
  customText?: string;
  customNote?: string;
  customIcon?: string;
}

export interface DashboardLayouts {
  [key: string]: Layout[];
}

export interface SavedLayout {
  id: string;
  name: string;
  layouts: DashboardLayouts;
  widgets: WidgetData[];
  createdAt: string;
}
