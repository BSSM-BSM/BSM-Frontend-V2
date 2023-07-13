import { WidgetData, WidgetType } from '@/types/widget.type';

export const getInitialWidgetData = (): WidgetData[] => {
  return [
    {
      i: 'tool_box',
      widgetType: WidgetType.TOOL_BOX,
      x: 1000,
      y: 0,
      w: 3,
      h: 1,
      static: true
    },
    {
      i: 'user',
      widgetType: WidgetType.USER,
      x: 0,
      y: 0,
      w: 7,
      h: 2,
      minW: 7,
      minH: 2,
      resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']
    },
    {
      i: 'meister',
      widgetType: WidgetType.MEISTER,
      x: 0,
      y: 1,
      w: 9,
      h: 2,
      minW: 9,
      minH: 2,
      resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']
    }
  ];
};
