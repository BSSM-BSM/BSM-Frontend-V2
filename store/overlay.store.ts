import { ReactNode } from "react";
import { atom } from "recoil";

export const loadingState = atom<boolean>({
    key: 'loadingState',
    default: false
});

export const toastState = atom<{
    [index: string]: {
        id: string,
        status: string,
        content: string | ReactNode
    }
}>({
    key: 'toastState',
    default: {}
});

export const alertState = atom<{
    status: string,
    msg: string | null
}>({
    key: 'alert',
    default: {
        status: '',
        msg: null
    }
});

export const alertTimerState = atom<{
    removeTimer: NodeJS.Timer | null,
    hideTimer: NodeJS.Timer | null
}>({
    key: 'alertTimer',
    default: {
        removeTimer: null,
        hideTimer: null
    }
});