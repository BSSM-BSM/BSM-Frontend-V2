import { atom } from "recoil";
import { localStorageEffect, LocalStorageType } from "../utils/localStorage";

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
    allMenu?: 'goBack'
}

export const headerOptionState = atom<headerOption>({
    key: 'title',
    default: {
        title: '',
        allMenu: undefined
    }
});