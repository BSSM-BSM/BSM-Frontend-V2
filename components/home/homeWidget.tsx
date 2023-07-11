import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import * as S from '@/styles/home.style';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useEffect, useState } from 'react';
import { Widget } from '@/types/widget.type';
import { UserHomeMenu } from '@/components/home/userMenu';
import { MeisterHomeMenu } from '@/components/home/meisterMenu';
const ResponsiveGridLayout = WidthProvider(Responsive);

export const HomeWidget = () => {
  const [widgetList, setWidgetList] = useState<Widget[]>([]);

  useEffect(() => {
    setWidgetList(() => [
      {
        i: 'user',
        element: <UserHomeMenu />,
        x: 0,
        y: 0,
        w: 3,
        h: 1,
        minW: 3,
        resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']
      },
      {
        i: 'meister',
        element: <MeisterHomeMenu />,
        x: 0,
        y: 1,
        w: 3,
        h: 1,
        minW: 3,
        resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']
      }
    ]);
  }, []);

  return (
    <S.MenuWrap>
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
        rowHeight={80}
        width={1000}
        isResizable={true}
        verticalCompact={false}
      >
        {widgetList.map(widget => (
          <div key={widget.i}>{widget.element}</div>
        ))}
      </ResponsiveGridLayout>
    </S.MenuWrap>
  );
};
