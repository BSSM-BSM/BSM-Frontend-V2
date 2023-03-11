import { atom } from "recoil";
import { HeaderOptionState } from "../types/common/header.type";
import { PageState } from "../types/page.type";
import { localStorageEffect, LocalStorageType } from "../utils/localStorage";
import { webPushEffect } from "../utils/webPush";

export const pushSubscriptionState = atom<PushSubscription | null>({
  key: 'pushSubscription',
  default: null,
  effects: [webPushEffect() ?? null]
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

export const headerOptionState = atom<HeaderOptionState>({
  key: 'title',
  default: {
    title: '',
    optionMenu: undefined
  }
});

export const pageState = atom<PageState>({
  key: 'page',
  default: {
    id: null
  }
});

export const sideBarState = atom<boolean>({
  key: 'title',
  default: false
});
