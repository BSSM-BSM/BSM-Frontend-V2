import styles from '../../../styles/board/board.module.css';
import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { titleState } from '../../../store/common.store';
import { Board, BoardListRes, Category, Post, PostListRes } from '../../../types/boardType';
import { PostItem } from '../../../components/board/postItem';

const BoardPage: NextPage = () => {
    const [, setTitle] = useRecoilState(titleState);
    const { ajax } = useAjax();
    const router = useRouter();
    const [ { boardId }, postId ] = [router.query, router.query.params?.[0]];
    const [boardList, setBoardList] = useState<{[index: string]: Board}>({});
    const [postList, setPostList] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [postLimit, setPostLimit] = useState<number>(0);

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
        loadPosts();
    }, [boardId]);

    const loadPosts = () => {
        ajax<PostListRes>({
            method: HttpMethod.GET,
            url: `post/${boardId}`,
            callback(data) {
                setPostList(data.posts);
                setTotalPages(data.totalPages);
                setPage(data.page);
                setPostLimit(data.limit);
            }
        });
    }
    
    return (
        <div className='container _100'>
            <Head>
                <title>커뮤니티 - BSM</title>
            </Head>
            <div className={styles.board}>
                <ul className={styles.post_list}>{
                    postList.map(post => (
                        <PostItem
                            key={`${boardId}${post.id}`}
                            {...post}
                            boardId={String(boardId)}
                            categoryList={boardList[String(boardId)]?.categoryList}
                        />
                    ))
                }</ul>
            </div>
        </div>
    );
}

export default BoardPage
