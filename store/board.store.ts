import { RefObject } from "react";
import { atom } from "recoil";
import { Editor } from "tinymce";
import { BoardAndPostId, Comment, DetailPost, Post } from "../types/boardType";
import { localStorageEffect, LocalStorageType } from "../utils/localStorage";

export const postIdState = atom<'write' | number | undefined>({
  key: 'postId',
  default: undefined
});

export const editPostIdState = atom<number | undefined>({
  key: 'editPostId',
  default: undefined
});

export const postListState = atom<Post[]>({
  key: 'postList',
  default: []
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

export const boardActiveEditorState = atom<RefObject<HTMLElement> | Editor | null>({
  key: 'boardActiveEditor',
  default: null,
  dangerouslyAllowMutability: true,
});