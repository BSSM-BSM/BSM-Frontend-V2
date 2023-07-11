import { ReactNode } from 'react';
import { Layout } from 'react-grid-layout';

export interface Widget extends Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  element: ReactNode;
}

export type WidgetList = Widget[];
