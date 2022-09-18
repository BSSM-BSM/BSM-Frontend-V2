import { atom } from "recoil";
import { localStorageEffect } from "../utils/localStorage";

export const postLimitState = atom<number>({
    key: 'postLimit',
    default: 15,
    effects: [localStorageEffect('postLimit', 'number')?? 15]
});

export const boardAndPostIdState = atom<{
    boardId: string,
    postId: number
}>({
    key: 'boardAndPostId',
    default: {
        boardId: '',
        postId: 0
    }
});