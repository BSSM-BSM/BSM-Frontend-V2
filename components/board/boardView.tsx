import styles from '../../styles/board/board.module.css';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { Board, Post, PostListRes } from '../../types/boardType';
import { PostItem } from './postItem';
import { useRecoilState } from 'recoil';
import { postLimitState } from '../../store/board.store';
import { CategoryList } from './categoryList';

interface BoardViewProps {
    boardId: string,
    board: Board
}

export const BoardView = ({ boardId, board }: BoardViewProps) => {
    const { ajax } = useAjax();
    const [postLimit] = useRecoilState(postLimitState);
    const [postList, setPostList] = useState<Post[]>([]);
    const [postCategory, setPostCategory] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [postLoadRef, inView] = useInView();

    useEffect(() => {
        if (loading) return;
        if (postList.length) setPostList([]);
        else loadPosts(-1);
    }, [postCategory]);

    useEffect(() => {
        if (postList.length) return;
        loadPosts(-1);
    }, [postList]);
    
    useEffect(() => {
        if (!postList.length || !inView || loading) return;
        setLoading(true);
        loadPosts(postList[postList.length-1]?.id ?? -1);
    }, [inView]);

    const loadPosts = (startPostId: number) => {
        ajax<PostListRes>({
            method: HttpMethod.GET,
            url: `post/${boardId}?i=${startPostId}&l=${postLimit}&c=${postCategory}`,
            callback(data) {
                if (data.posts.length) setPostList(prev => [...prev, ...data.posts]);
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
                        key={`${boardId}${post.id}`}
                        {...post}
                        boardId={String(boardId)}
                        categoryList={board.categoryList}
                    />
                ))}
                {postList[postList.length-1]?.id > 1 && <li ref={postLoadRef} className={styles.post_load_bar}></li>}
            </ul>
        </div>
    );
}