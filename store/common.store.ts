import { atom } from "recoil";
import { localStorageEffect, LocalStorageType } from "../utils/localStorage";
import { webPushEffect } from "../utils/webPush";

export const pushSubscriptionState = atom<PushSubscription | null>({
    key: 'pushSubscription',
    default: null,
    effects: [webPushEffect()?? null]
})

export const themeState = atom<string>({
    key: 'theme',
    default: 'dark',
    effects: [localStorageEffect('theme', LocalStorageType.string)?? 'dark']
});

export const screenScaleState = atom<number>({
    key: 'screenScale',
    default: 100,
    effects: [localStorageEffect('screenScale', LocalStorageType.number)?? 100]
});

export interface headerOption {
    title: string,
    allMenu?: {
        goBack?: boolean;
        dropdownMenu?: DropdownMenuOption[];
    },
    optionMenu?: {
        dropdownMenu?: DropdownMenuOption[];
    }
}

export interface DropdownMenuOption {
    text: string,
    callback: () => void
};

export const headerOptionState = atom<headerOption>({
    key: 'title',
    default: {
        title: '',
        allMenu: undefined,
        optionMenu: undefined
    }
});