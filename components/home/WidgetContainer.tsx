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
        w: 2,
        h: 1,
        static: true
      },
      {
        i: 'user',
        element: <UserHomeWidget />,
        x: 0,
        y: 0,
        w: 6,
        h: 2,
        minW: 6,
        minH: 2,
        resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']
      },
      {
        i: 'meister',
        element: <MeisterHomeWidget />,
        x: 0,
        y: 1,
        w: 7,
        h: 2,
        minW: 7,
        minH: 2,
        resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']
      }
    ]);
  }, [isWidgetLock]);

  return (
    <S.WidgetWrap>
      <ResponsiveGridLayout
        layouts={{
          lg: widgetList
        }}
        breakpoints={{
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480
        }}
        cols={{ lg: 35, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={35}
        width={1200}
        isResizable={!isWidgetLock}
        isDraggable={!isWidgetLock}
        verticalCompact={false}
      >
        {widgetList.map(widget => (
          <div key={widget.i}>{widget.element}</div>
        ))}
      </ResponsiveGridLayout>
    </S.WidgetWrap>
  );
};
