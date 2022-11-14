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
    effects: [localStorageEffect({
        key: 'theme',
        type: LocalStorageType.string,
        defaultValue: 'dark'
    })]
});

export const screenScaleState = atom<number>({
    key: 'screenScale',
    default: 100,
    effects: [localStorageEffect({
        key: 'screenScale',
        type: LocalStorageType.number,
        defaultValue: 100
    })]
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