import { ReactNode } from "react";
import { atom } from "jotai";

export const loadingState = atom<boolean>(false);

export const toastState = atom<{
  [index: string]: {
    id: string,
    status: string,
    content: string | ReactNode
  }
}>({});

export const alertState = atom<{
  status: string,
  msg: string | null
}>({
  status: '',
  msg: null
});

export const alertTimerState = atom<{
  removeTimer: NodeJS.Timeout | null,
  hideTimer: NodeJS.Timeout | null
}>({
  removeTimer: null,
  hideTimer: null
});