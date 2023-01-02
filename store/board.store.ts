import { RefObject } from "react";
import { atom } from "recoil";
import { Editor } from "tinymce";
import { BoardAndPostId, Comment, DetailPost, Post } from "../types/boardType";
import { localStorageEffect, LocalStorageType } from "../utils/localStorage";

export const postListState = atom<Post[]>({
    key: 'postList',
    default: []
});

export const postLimitState = atom<number>({
    key: 'postLimit',
    default: 15,
    effects: [localStorageEffect({
        key: 'postLimit',
        type: LocalStorageType.number,
        defaultValue: 15
    })]
});

export const boardAndPostIdState = atom<BoardAndPostId>({
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

export const boardOpenAllChildCommentsState = atom<boolean>({
    key: 'boardOpenAllChildComments',
    default: false,
    effects: [localStorageEffect({
        key: 'boardOpenAllChildComments',
        type: LocalStorageType.boolean,
        defaultValue: false
    })]
});

export const boardActiveEditorState = atom<RefObject<HTMLElement> | Editor | null>({
    key: 'boardActiveEditor',
    default: null,
    dangerouslyAllowMutability: true,
});