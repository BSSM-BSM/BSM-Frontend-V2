import styles from '../../styles/board/board.module.css';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { Board, Post, PostListRes } from '../../types/boardType';
import { PostItem } from './postItem';
import { useRecoilState } from 'recoil';
import { postLimitState, postListState } from '../../store/board.store';
import { CategoryList } from './categoryList';
import Link from 'next/link';

interface BoardViewProps {
    boardId: string,
    board: Board
}

export const BoardView = ({ boardId, board }: BoardViewProps) => {
    const { ajax } = useAjax();
    const [postLimit] = useRecoilState(postLimitState);
    const [postList, setPostList] = useRecoilState(postListState);
    const [postCategory, setPostCategory] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const [postLoadRef, inView] = useInView();

    useEffect(() => {
        if (loading) return;
        else loadPosts(-1);
    }, [postCategory, boardId]);
    
    useEffect(() => {
        if (!postList.length || !inView || loading) return;
        loadPosts(postList[postList.length-1]?.id ?? -1);
    }, [inView]);

    const loadPosts = (startPostId: number) => {
        setLoading(true);
        ajax<PostListRes>({
            method: HttpMethod.GET,
            url: `post/${boardId}?i=${startPostId}&l=${postLimit}&c=${postCategory}`,
            callback(data) {
                if (startPostId === -1) setPostList(data.posts);
                else if (data.posts.length) setPostList(prev => [...prev, ...data.posts]);
                setLoading(false);
            },
            errorCallback() {
                setLoading(false);
            }
        });
    }
    
    return (
        <div className='container'>
            <div>
                <CategoryList
                    postCategory={postCategory}
                    setPostCategory={setPostCategory}
                    categoryList={
                        [
                            {id: 'all', name: '전체'},
                            {id: 'normal', name: '일반'},
                            ...Object.values(board.categoryList)
                        ]
                    }
                />
            </div>
            <ul className={styles.post_list}>
                {postList.map(post => (
                    <PostItem
                        key={`${boardId}/${post.id}/${post.user.code}`}
                        {...post}
                        boardId={String(boardId)}
                        categoryList={board.categoryList}
                    />
                ))}
                {postList[postList.length-1]?.id > 1 && <li ref={postLoadRef} className={styles.post_load_bar}></li>}
            </ul>
            {
                board.postPermission &&
                <Link href={`/board/${boardId}/write`}>
                    <a className={styles.write}><img src='/icons/pen.svg' alt='글쓰기' /></a>
                </Link>
            }
        </div>
    );
}