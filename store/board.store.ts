import { atom } from "recoil";
import { Comment } from "../types/boardType";
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

export const parentCommentState = atom<Comment | null>({
    key: 'parentComment',
    default: null
});