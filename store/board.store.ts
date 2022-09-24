import { atom } from "recoil";
import { Comment, DetailPost } from "../types/boardType";
import { localStorageEffect, LocalStorageType } from "../utils/localStorage";

export const postLimitState = atom<number>({
    key: 'postLimit',
    default: 15,
    effects: [localStorageEffect('postLimit', LocalStorageType.number)?? 15]
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

export const postState = atom<DetailPost | null>({
    key: 'post',
    default: null
});

export const postOpenState = atom<boolean>({
    key: 'postOpen',
    default: false
});

export const parentCommentState = atom<Comment | null>({
    key: 'parentComment',
    default: null
});

export const boardDetailTimeState = atom<boolean>({
    key: 'boardDetailTime',
    default: false,
    effects: [localStorageEffect('boardDetailTime', LocalStorageType.boolean)?? false]
});