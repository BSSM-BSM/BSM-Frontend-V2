import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { HeaderOptionState } from "@/types/common/header.type";
import { PageState } from "@/types/page.type";
import { getPushSubscription } from "@/utils/webPush";

export const pushSubscriptionState = atom<PushSubscription | null>(null);
pushSubscriptionState.onMount = (setAtom) => {
  getPushSubscription().then(setAtom);
};

export const themeState = atomWithStorage<string>('theme', 'dark');

export const screenScaleState = atomWithStorage<number>('screenScale', 100);

export const headerOptionState = atom<HeaderOptionState>({
  title: '',
  headTitle: '',
  optionMenu: undefined
});

export const pageState = atom<PageState>({
  id: null
});

export const sideBarState = atom<boolean>(false);

export const backgroundImageUrlState = atomWithStorage<string | undefined>('backgroundImageUrl', undefined);

export const customBackgroundOnlyHomeState = atomWithStorage<boolean>('customBackgroundOnlyHome', true);