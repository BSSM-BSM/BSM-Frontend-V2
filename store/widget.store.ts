import { atom } from "recoil";

export const widgetLockState = atom<boolean>({
  key: 'widgetLock',
  default: true
});
