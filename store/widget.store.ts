import { WidgetData } from "@/types/widget.type";
import { getInitialWidgetData } from "@/utils/widget";
import { atom } from "recoil";

export const widgetState = atom<WidgetData[]>({
  key: 'widget',
  default: getInitialWidgetData()
});

export const widgetLockState = atom<boolean>({
  key: 'widgetLock',
  default: true
});
