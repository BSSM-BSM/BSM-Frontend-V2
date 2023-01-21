'use client';

import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { editPostIdState, postIdState } from '../../../../store/board.store';
import React from 'react';

interface BoardPageProps {
  params: {
    boardId: string,
    boardArgs: string[]
  }
}

const BoardPage = (props: BoardPageProps) => {
  const {params} = props;
  const [postId, editPostId] = params.boardArgs ?? [undefined, undefined];
  const [setPostId, setEditPostId] = [useSetRecoilState(postIdState), useSetRecoilState(editPostIdState)];

  useEffect(() => {
    if (postId === 'write') return setPostId(postId);
    if (Number(postId) % 1 === 0) return setPostId(Number(postId));
    setPostId(undefined);
  }, [postId]);

  useEffect(() => {
    if (Number(editPostId) % 1 === 0) return setEditPostId(Number(editPostId));
    setEditPostId(undefined);
  }, [editPostId]);

  return (<></>);
}

export default BoardPage;
