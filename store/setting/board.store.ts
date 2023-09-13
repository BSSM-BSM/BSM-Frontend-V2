import { atom } from "recoil";
import { localStorageEffect, LocalStorageType } from "@/utils/localStorage";

export const postLimitState = atom<number>({
  key: 'postLimit',
  default: 15,
  effects: [localStorageEffect({
      key: 'postLimit',
      type: LocalStorageType.number,
      defaultValue: 15
  })]
});

export const boardDetailTimeState = atom<boolean>({
  key: 'boardDetailTime',
  default: false,
  effects: [localStorageEffect({
      key: 'boardDetailTime',
      type: LocalStorageType.boolean,
      defaultValue: false
  })]
});

export const boardAnonymousModeState = atom<boolean>({
  key: 'boardAnonymousMode',
  default: false,
  effects: [localStorageEffect({
      key: 'boardAnonymousMode',
      type: LocalStorageType.boolean,
      defaultValue: false
  })]
});

export const boardNoRecordModeState = atom<boolean>({
  key: 'boardNoRecordMode',
  default: false,
  effects: [localStorageEffect({
      key: 'boardNoRecordMode',
      type: LocalStorageType.boolean,
      defaultValue: false
  })]
});

export const boardOpenAllChildCommentsState = atom<boolean>({
  key: 'boardOpenAllChildComments',
  default: false,
  effects: [localStorageEffect({
      key: 'boardOpenAllChildComments',
      type: LocalStorageType.boolean,
      defaultValue: false
  })]
});