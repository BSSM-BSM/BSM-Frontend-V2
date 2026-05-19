import { localStorageAtom } from "@/utils/localStorage";

export const postLimitState = localStorageAtom<number>('postLimit', 15);

export const boardDetailTimeState = localStorageAtom<boolean>('boardDetailTime', false);

export const boardAnonymousModeState = localStorageAtom<boolean>('boardAnonymousMode', false);

export const boardNoRecordModeState = localStorageAtom<boolean>('boardNoRecordMode', false);

export const boardOpenAllChildCommentsState = localStorageAtom<boolean>('boardOpenAllChildComments', false);