import { atom } from "recoil";
import { localStorageEffect } from "../utils/localStorage";

export const themeState = atom<string>({
    key: 'theme',
    default: 'dark',
    effects: [localStorageEffect('theme', 'string')?? 'dark']
});

export const screenScaleState = atom<number>({
    key: 'screenScale',
    default: 100,
    effects: [localStorageEffect('screenScale', 'number')?? 100]
});

export const titleState = atom<string>({
    key: 'title',
    default: ''
});
