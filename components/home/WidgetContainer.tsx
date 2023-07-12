import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import * as S from '@/styles/home.style';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useEffect, useState } from 'react';
import { Widget } from '@/types/widget.type';
import { UserHomeWidget } from '@/components/home/userWidget';
import { MeisterHomeWidget } from '@/components/home/meisterWidget';
import { HomeToolBox } from '@/components/home/homeToolBox';
import { useRecoilValue } from 'recoil';
import { widgetLockState } from '@/store/widget.store';

const ResponsiveGridLayout = WidthProvider(Responsive);

const breakpoints: { [index: string]: number } = {};
const cols: { [index: string]: number } = {};
const WIDGET_COL_WIDTH = 36;
const MAX_CONTAINER_WIDTH = 1920;

let maxBreakPoint = 0;
for (let i = 4; i * WIDGET_COL_WIDTH < MAX_CONTAINER_WIDTH; i += 2) {
  breakpoints[i] = i * WIDGET_COL_WIDTH;
  cols[i] = i;
  maxBreakPoint = i;
}

export const WidgetContainer = () => {
  const [widgetList, setWidgetList] = useState<Widget[]>([]);
  const isWidgetLock = useRecoilValue(widgetLockState);

  useEffect(() => {
    setWidgetList(() => [
      {
        i: 'tool_box',
        element: <HomeToolBox />,
        x: 1000,
        y: 0,
        w: 3,
        h: 1,
        static: true
      },
      {
        i: 'user',
        element: <UserHomeWidget />,
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
        element: <MeisterHomeWidget />,
        x: 0,
        y: 1,
        w: 9,
        h: 2,
        minW: 9,
        minH: 2,
        resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']
      }
    ]);
  }, [isWidgetLock]);

  return (
    <S.WidgetWrap>
      <ResponsiveGridLayout
        layouts={{
          [maxBreakPoint]: widgetList
        }}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={35}
        isResizable={!isWidgetLock}
        isDraggable={!isWidgetLock}
        compactType={null}
      >
        {widgetList.map(widget => (
          <div key={widget.i}>{widget.element}</div>
        ))}
      </ResponsiveGridLayout>
    </S.WidgetWrap>
  );
};
