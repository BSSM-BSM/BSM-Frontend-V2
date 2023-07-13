import { ReactNode } from 'react';
import { Layout } from 'react-grid-layout';

export interface Widget extends Layout {
  i: string;
  element: ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetData extends Layout {
  i: string;
  widgetType: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
}

export enum WidgetType {
  TOOL_BOX = 'TOOL_BOX',
  USER = 'USER',
  MEISTER = 'MEISTER'
}
