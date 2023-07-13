import { HomeToolBox } from '@/components/home/homeToolBox';
import { MeisterHomeWidget } from '@/components/home/meisterWidget';
import { UserHomeWidget } from '@/components/home/userWidget';
import { Widget, WidgetData, WidgetType } from '@/types/widget.type';

interface UseWidget {
  getWidgetElement: GetWidgetElement;
  getWidget: GetWidget;
}

type GetWidgetElement = (type: WidgetType) => JSX.Element;
type GetWidget = (widgetData: WidgetData) => Widget;

export const useWidget = (): UseWidget => {
  const WidgetElements: {
    [key in keyof typeof WidgetType]: JSX.Element;
  } = {
    TOOL_BOX: <HomeToolBox />,
    USER: <UserHomeWidget />,
    MEISTER: <MeisterHomeWidget />
  };

  const getWidgetElement = (type: WidgetType) => WidgetElements[type];

  const getWidget = (widgetData: WidgetData): Widget => ({
    ...widgetData,
    element: getWidgetElement(widgetData.widgetType)
  });

  return {
    getWidgetElement,
    getWidget
  };
};
