import styles from '../../../styles/board/post/post-nav.module.css';
import Link from "next/link";
import { Post } from "../../../types/boardType";

interface PostNavBarProps {
    boardId: string,
    prevPost: Post | undefined,
    nextPost: Post | undefined
}

export const PostNavBar = ({
    boardId,
    prevPost,
    nextPost
}: PostNavBarProps) => (
    <div className={styles.nav_wrap}>
        {
            prevPost && 
            <Link href={`/board/${boardId}/${prevPost.id}`}>
                <a className={styles.prev}>
                    <span>{prevPost.title}</span>
                    <span>◀ 이전글</span>
                    <span>◀</span>
                </a>
            </Link>
        }
        {
            nextPost && 
            <Link href={`/board/${boardId}/${nextPost.id}`}>
                <a className={styles.next}>
                    <span>{nextPost.title}</span>
                    <span>다음글 ▶</span>
                    <span>▶</span>
                </a>
            </Link>
        }
        <div className={styles.dim}></div>
    </div>
);