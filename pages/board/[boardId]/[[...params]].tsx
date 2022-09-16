import postStyles from '../../../styles/board/post.module.css';
import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { titleState } from '../../../store/common.store';
import { Board, BoardListRes, Category, DetailPost } from '../../../types/boardType';
import { BoardView } from '../../../components/board/boardView';
import { PostView } from '../../../components/board/postView';

const BoardPage: NextPage = () => {
    const { ajax } = useAjax();
    const [, setTitle] = useRecoilState(titleState);
    const router = useRouter();
    const [ { boardId }, postId ] = [router.query, router.query.params?.[0]];
    const [boardList, setBoardList] = useState<{[index: string]: Board}>({});
    const [post, setPost] = useState<DetailPost | null>(null);
    const [postOpen, setPostOpen] = useState<boolean>(true);
    
    useEffect(() => {
        if (typeof boardId !== 'string') return setTitle('');
        if (postId === undefined) setTitle(boardList[boardId]?.boardName);
    }, [boardId, postId, boardList]);

    useEffect(() => {
        if (typeof boardId !== 'string') return;
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
                if (data && data.statusCode === 404) {
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
        if (
            typeof boardId !== 'string'
            || typeof postId !== 'string'
        ) return;
        ajax<DetailPost>({
            method: HttpMethod.GET,
            url: `post/${boardId}/${postId}`,
            callback(data) {
                setPostOpen(true);
                setPost(data);
            },
            errorCallback() {
                setPost(null)
            },
        })
    }, [postId, boardId]);

    return (
        <div className='container'>
            <Head>
                <title>커뮤니티 - BSM</title>
            </Head>
            {
                typeof boardId === 'string' 
                && boardList[boardId] 
                && <BoardView boardId={boardId} board={boardList[boardId]} />
            }
            <div className={`${postStyles.post} ${postOpen? postStyles.open: ''}`}>
                {
                    typeof postId === 'string'
                    && post
                    && <PostView post={post} />
                }
            </div>
        </div>
    );
}

export default BoardPage
