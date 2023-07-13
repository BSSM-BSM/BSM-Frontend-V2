import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import * as S from '@/styles/home.style';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { widgetLockState, widgetState } from '@/store/widget.store';
import { useEffect, useState } from 'react';
import { Widget } from '@/types/widget.type';
import { useWidget } from '@/hooks/useWidget';

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
  const { getWidget } = useWidget();
  const [widgetDataList, setWidgetDataList] = useRecoilState(widgetState);
  const [widgetList, setWidgetList] = useState<Widget[]>([]);
  const isWidgetLock = useRecoilValue(widgetLockState);

  useEffect(() => {
    setWidgetList(widgetDataList.map(data => getWidget(data)));
  }, [widgetDataList]);

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
