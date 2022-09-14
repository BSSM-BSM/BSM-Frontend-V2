import styles from '../../styles/board/board.module.css';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { Board, Post, PostListRes } from '../../types/boardType';
import { PostItem } from './postItem';

interface BoardViewProps {
    boardId: string,
    board: Board
}

export const BoardView = ({ boardId, board }: BoardViewProps) => {
    const { ajax } = useAjax();
    const [postList, setPostList] = useState<Post[]>([]);
    const [postLimit, setPostLimit] = useState<number>(0);
    const [startPostId, setStartPostId] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(false);
    const [postLoadRef, inView] = useInView();

    useEffect(() => {
        loadPosts();
    }, []);

    // useEffect(() => {
    // }, [postList]);
    
    useEffect(() => {
        if (!inView || loading) return;
        setLoading(true);
        loadPosts();
    }, [inView]);

    const loadPosts = () => {
        ajax<PostListRes>({
            method: HttpMethod.GET,
            url: `post/${boardId}?i=${startPostId}`,
            callback(data) {
                if (!data.posts.length) return;
                setStartPostId(data.posts[data.posts.length-1].id);
                setPostLimit(data.limit);
                setPostList(prev => [...prev, ...data.posts]);
                setLoading(false);
            },
            errorCallback() {
                setLoading(false);
            }
        });
    }
    
    return (
        <div className={styles.board}>
            {`${startPostId} | ${inView} | ${loading}`}
            <ul className={styles.post_list}>
                {postList.map(post => (
                    <PostItem
                        key={`${boardId}${post.id}`}
                        {...post}
                        boardId={String(boardId)}
                        categoryList={board.categoryList}
                    />
                ))}
                {startPostId > 1 && <li ref={postLoadRef} className={styles.post_load_bar}></li>}
            </ul>
        </div>
    )
}