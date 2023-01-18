'use client';

import postStyles from '../../../../styles/board/post/post.module.css';
import type { NextPage } from 'next'
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../../../hooks/useAjax';
import { headerOptionState } from '../../../../store/common.store';
import { Board, BoardListRes, Category, Comment, DeletedComment, DetailPost } from '../../../../types/boardType';
import { BoardView } from '../../../../components/board/boardView';
import { PostView } from '../../../../components/board/post/postView';
import { boardAndPostIdState, boardAnonymousModeState, postOpenState, postState } from '../../../../store/board.store';
import { PostWrite } from '../../../../components/board/post/postWrite';
import { EmoticonBoxWrap } from '../../../../components/board/emoticonBox';
import React from 'react';

interface BoardPageProps {
  params: {
    boardId: string,
    boardArgs?: string[]
  },
  searchParams: {
    [index: string]: string
  }
}

const BoardPage = ({params}: BoardPageProps) => {
  const { ajax } = useAjax();
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const [, setBoardAndPostId] = useRecoilState(boardAndPostIdState);
  const [boardAnonymousMode] = useRecoilState(boardAnonymousModeState);

  const {boardId} = params
  const [postId, editPostId] = params.boardArgs ?? [undefined, undefined];
  const [boardList, setBoardList] = useState<{ [index: string]: Board }>({});
  const [post, setPost] = useRecoilState(postState);
  const [postOpen, setPostOpen] = useRecoilState(postOpenState);
  const [commentList, setCommentList] = useState<(Comment | DeletedComment)[]>([]);

  useEffect(() => {
    if (typeof boardId !== 'string')
      setHeaderOption({ title: '' });
    else if (typeof postId !== 'string')
      setHeaderOption({ title: boardList[boardId]?.boardName });
    else if (postId === 'write')
      setHeaderOption({
        title: `글쓰기 ${boardAnonymousMode ? '(익명 On)' : '(익명 Off)'}`,
        allMenu: {
          goBack: true
        }
      });
  }, [boardId, postId, boardList, post]);

  useEffect(() => {
    if (typeof boardId !== 'string') return;
    setPost(null);
    if (boardList[boardId]) return;

    setBoardList(prev => ({
      ...prev,
      [boardId]: {
        boardId,
        boardName: '',
        subBoardId: null,
        subBoardName: null,
        categoryList: {},
        postPermission: false,
        commentPermission: false
      }
    }));
    getBoardInfo(boardId);
  }, [boardId]);

  useEffect(() => {
    if (typeof postId !== 'string') setPostOpen(false);
  }, [postId]);

  useEffect(() => {
    if (postId === 'write') return;
    if (post?.id === Number(postId)) {
      setPostOpen(true);
    } else {
      loadPostAndComments();
    }
  }, [postId, boardId]);

  const getBoardInfo = async (boardId: string) => {
    const [data, error] = await ajax<BoardListRes>({
      method: HttpMethod.GET,
      url: `board/${boardId}`,
      errorCallback(data) {
        if (data && 'statusCode' in data && data.statusCode === 404) {
          if (typeof boardId !== 'string') return;
          setBoardList(prev => {
            delete prev[boardId];
            return prev;
          });
        }
      }
    });
    if (error) return;

    const categoryList: { [index: string]: Category } = {};
    data.categoryList.forEach(category => {
      categoryList[category.id] = category;
    });
    setBoardList(prev => ({
      ...prev,
      [boardId]: {
        ...data,
        categoryList
      }
    }));
  }

  const loadPostAndComments = async () => {
    if (typeof boardId !== 'string' || typeof postId !== 'string') return;
    const [data, error] = await ajax<DetailPost>({
      method: HttpMethod.GET,
      url: `post/${boardId}/${postId}`,
      errorCallback() {
        setPost(null);
      },
    });
    if (error) return;

    setBoardAndPostId({
      boardId,
      postId: Number(postId)
    });
    setPostOpen(true);
    setPost(data);
    loadComments();
  }

  const loadComments = async () => {
    const [data, error] = await ajax<(Comment | DeletedComment)[]>({
      method: HttpMethod.GET,
      url: `comment/${boardId}/${postId}`,
      errorCallback() {
        setCommentList([]);
      },
    });
    if (error) return;

    setCommentList(data);
  }

  return (
    <div className='container'>
      <Head>
        <title>커뮤니티 - BSM</title>
      </Head>
      {
        typeof boardId === 'string'
        && boardList[boardId]
        && <>
          <BoardView boardId={boardId} board={boardList[boardId]} />
          <div className={`${postStyles.post} ${postOpen ? postStyles.open : ''}`}>
            {
              post?.id === Number(postId)
              && <PostView
                board={boardList[boardId]}
                post={post}
                commentList={commentList}
                loadComments={loadComments}
              />
            }
          </div>
        </>
      }
      {
        typeof boardId === 'string'
        && <div className={`${postStyles.post} ${postStyles.post_write_wrap} ${boardList[boardId] && postId === 'write' ? postStyles.open : ''}`}>
          <PostWrite
            boardId={boardId}
            postId={postId}
            categoryList={boardList[boardId]?.categoryList ?? {}}
            editPost={Number(editPostId) === post?.id ? post : null}
            setPost={setPost}
          />
        </div>
      }
      <EmoticonBoxWrap />
    </div>
  );
}

export default BoardPage;
