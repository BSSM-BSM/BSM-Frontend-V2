import { atomWithStorage } from "jotai/utils";

export const postLimitState = atomWithStorage<number>('postLimit', 15);

export const boardDetailTimeState = atomWithStorage<boolean>('boardDetailTime', false);

export const boardAnonymousModeState = atomWithStorage<boolean>('boardAnonymousMode', false);

export const boardNoRecordModeState = atomWithStorage<boolean>('boardNoRecordMode', false);

export const boardOpenAllChildCommentsState = atomWithStorage<boolean>('boardOpenAllChildComments', false);