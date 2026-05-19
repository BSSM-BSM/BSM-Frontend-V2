import { RefObject } from "react";
import { atom } from "jotai";
import { Editor } from "tinymce";
import { BoardAndPostId, Comment, DetailPost, Post } from "@/types/board.type";

export const postIdState = atom<'write' | number | undefined>(undefined);

export const editPostIdState = atom<number | undefined>(undefined);

export const postListState = atom<Post[]>([]);

export const boardAndPostIdState = atom<BoardAndPostId>({
  boardId: '',
  postId: 0
});

export const postState = atom<DetailPost | null>(null);

export const postOpenState = atom<boolean>(false);

export const parentCommentState = atom<Comment | null>(null);

export const boardActiveEditorState = atom<RefObject<HTMLElement> | Editor | null>(null);