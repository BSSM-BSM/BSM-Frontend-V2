import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { HeaderOptionState } from "@/types/common/header.type";
import { PageState } from "@/types/page.type";
import { localStorageAtom } from "@/utils/localStorage";
import { getPushSubscription } from "@/utils/webPush";

export const pushSubscriptionState = atom<PushSubscription | null>(null);
pushSubscriptionState.onMount = (setAtom) => {
  getPushSubscription().then(setAtom);
};

export const themeState = localStorageAtom<string>('theme', 'dark');

export const screenScaleState = localStorageAtom<number>('screenScale', 100);

export const headerOptionState = atom<HeaderOptionState>({
  title: '',
  headTitle: '',
  optionMenu: undefined
});

export const pageState = atom<PageState>({
  id: null
});

export const sideBarState = atom<boolean>(false);

export const backgroundImageUrlState = localStorageAtom<string | undefined>('backgroundImageUrl', undefined);

export const customBackgroundOnlyHomeState = localStorageAtom<boolean>('customBackgroundOnlyHome', true);