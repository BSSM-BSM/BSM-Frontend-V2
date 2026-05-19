'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { editPostIdState, postIdState } from '@/store/board.store';

interface BoardPageProps {
  params: {
    boardId: string;
    boardArgs: string[];
  };
}

const BoardPage = (props: BoardPageProps) => {
  const { params } = props;
  const [postId, editPostId] = params.boardArgs ?? [undefined, undefined];
  const [setPostId, setEditPostId] = [useSetAtom(postIdState), useSetAtom(editPostIdState)];

  useEffect(() => {
    if (postId === 'write') return setPostId(postId);
    if (Number(postId) % 1 === 0) return setPostId(Number(postId));
    setPostId(undefined);
  }, [postId]);

  useEffect(() => {
    if (Number(editPostId) % 1 === 0) return setEditPostId(Number(editPostId));
    setEditPostId(undefined);
  }, [editPostId]);

  return <></>;
};

export default BoardPage;
