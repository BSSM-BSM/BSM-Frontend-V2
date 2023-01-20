'use client';

import postStyles from '../../../styles/board/post/post.module.css';
import Head from 'next/head';
import { ReactNode, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { BoardView } from '../../../components/board/boardView';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { boardAndPostIdState, editPostIdState, postIdState, postOpenState, postState } from '../../../store/board.store';
import { headerOptionState } from '../../../store/common.store';
import { Board, BoardListRes, Category, Comment, DeletedComment, DetailPost } from '../../../types/boardType';
import { PostView } from '../../../components/board/post/postView';
import { EmoticonBoxWrap } from '../../../components/board/emoticonBox';
import { PostWrite } from '../../../components/board/post/postWrite';
import { boardAnonymousModeState } from '../../../store/setting/board.store';

interface BoardLayoutProps {
  children: ReactNode,
  params: {
    boardId: string
  },
  searchParams: {
    [index: string]: string
  }
}

const BoardLayout = ({
  children,
  params: {
    boardId
  }
}: BoardLayoutProps) => {
  const { ajax } = useAjax();
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setBoardAndPostId = useSetRecoilState(boardAndPostIdState);
  const boardAnonymousMode = useRecoilValue(boardAnonymousModeState);

  const postId = useRecoilValue(postIdState);
  const editPostId = useRecoilValue(editPostIdState);
  const [boardList, setBoardList] = useState<{ [index: string]: Board }>({});
  const [post, setPost] = useRecoilState(postState);
  const [postOpen, setPostOpen] = useRecoilState(postOpenState);
  const [commentList, setCommentList] = useState<(Comment | DeletedComment)[]>([]);

  useEffect(() => {
    if (typeof boardId !== 'string')
      setHeaderOption({ title: '' });
    else if (postId === undefined)
      setHeaderOption({ title: boardList[boardId]?.boardName });
    else if (postId === 'write')
      setHeaderOption({
        title: `글쓰기 ${boardAnonymousMode ? '(익명 On)' : '(익명 Off)'}`,
        allMenu: {
          goBack: true
        }
      });
  }, [boardId, postId, boardList, post, boardAnonymousMode]);

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
    if (postId === undefined) setPostOpen(false);
  }, [postId]);

  useEffect(() => {
    if (typeof postId !== 'number') return;
    if (post?.id === postId) {
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
    if (typeof boardId !== 'string' || typeof postId !== 'number') return;
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
        typeof boardId === 'string' &&
        boardList[boardId] &&
        <>
          <BoardView boardId={boardId} board={boardList[boardId]} />
          <div className={`${postStyles.post} ${postOpen ? postStyles.open : ''}`}>
            {
              typeof postId === 'number' &&
              post?.id === postId &&
              <PostView
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
        <div className={`${postStyles.post} ${postStyles.post_write_wrap} ${boardList[boardId] && postId === 'write' ? postStyles.open : ''}`}>
          <PostWrite
            boardId={boardId}
            categoryList={boardList[boardId]?.categoryList ?? {}}
            editPost={editPostId === post?.id ? post : null}
            setPost={setPost}
          />
        </div>
      }
      {children}
      <EmoticonBoxWrap />
    </div>
  );
}

export default BoardLayout;
