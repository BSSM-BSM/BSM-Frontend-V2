import postStyles from '../../../styles/board/post.module.css';
import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { ErrorResType, HttpMethod, useAjax } from '../../../hooks/useAjax';
import { headerOptionState } from '../../../store/common.store';
import { Board, BoardListRes, Category, Comment, DeletedComment, DetailPost } from '../../../types/boardType';
import { BoardView } from '../../../components/board/boardView';
import { PostView } from '../../../components/board/postView';
import { boardAndPostIdState, postOpenState, postState } from '../../../store/board.store';
import { PostWrite } from '../../../components/board/postWrite';

const BoardPage: NextPage = () => {
    const {ajax} = useAjax();
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const router = useRouter();
    const [, setBoardAndPostId] = useRecoilState(boardAndPostIdState);

    const {boardId} = router.query;
    const [postId, editPostId] = router.query.params?.length? router.query.params: [undefined, undefined];
    const [boardList, setBoardList] = useState<{[index: string]: Board}>({});
    const [post, setPost] = useRecoilState(postState);
    const [postOpen, setPostOpen] = useRecoilState(postOpenState);
    const [commentList, setCommentList] = useState<(Comment | DeletedComment)[]>([]);

    useEffect(() => {
        if (typeof boardId !== 'string') 
            setHeaderOption({title: ''});
        else if (typeof postId !== 'string') 
            setHeaderOption({title: boardList[boardId]?.boardName});
        else if (postId === 'write')
            setHeaderOption({
                title: boardList[boardId]?.boardName,
                allMenu: 'goBack'
            });    
    }, [boardId, postId, boardList, post]);

    useEffect(() => {
        if (typeof boardId !== 'string') return;
        setPost(null);
        ajax<BoardListRes>({
            method: HttpMethod.GET,
            url: `board/${boardId}`,
            callback(data) {
                const categoryList: {[index: string]: Category} = {};
                data.categoryList.forEach(category => {
                    categoryList[category.id] = category;
                });
                setBoardList(prev => ({
                    ...prev,
                    [data.boardId]: {
                        ...data,
                        categoryList
                    }
                }));
            },
            errorCallback(data) {
                if (data instanceof ErrorResType && data.statusCode === 404) {
                    if (typeof boardId !== 'string') return;
                    setBoardList(prev => {
                        delete prev[boardId];
                        return prev;
                    });
                }
            },
        });
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

    const loadPostAndComments = () => {
        if (
            typeof boardId !== 'string'
            || typeof postId !== 'string'
        ) return;
        ajax<DetailPost>({
            method: HttpMethod.GET,
            url: `post/${boardId}/${postId}`,
            callback(data) {
                setBoardAndPostId({
                    boardId,
                    postId: Number(postId)
                });
                setPostOpen(true);
                setPost(data);
            },
            errorCallback() {
                setPost(null)
            },
        });
        loadComments();
    }

    const loadComments = () => {
        ajax<(Comment | DeletedComment)[]>({
            method: HttpMethod.GET,
            url: `comment/${boardId}/${postId}`,
            callback(data) {
                setCommentList(data);
            },
            errorCallback() {
                setCommentList([]);
            },
        });
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
                    <div className='scroll-bar'>
                        <BoardView boardId={boardId} board={boardList[boardId]} />
                    </div>
                    <div className={`${postStyles.post} ${postOpen? postStyles.open: ''} scroll-bar`}>
                        {
                            typeof postId === 'string'
                            && postId !== 'write'
                            && post
                            && <PostView board={boardList[boardId]} post={post} commentList={commentList} loadComments={loadComments} />
                        }
                    </div>
                </>
            }
            {
                typeof boardId === 'string'
                && <div className={`${postStyles.post} ${boardList[boardId] && postId === 'write'? postStyles.open: ''} full-screen`}>
                    <PostWrite
                        boardId={boardId}
                        categoryList={boardList[boardId]?.categoryList ?? {}}
                        editPost={Number(editPostId) === post?.id? post: null}
                        setPost={setPost}
                    />
                </div>
            }
        </div>
    );
}

export default BoardPage;
