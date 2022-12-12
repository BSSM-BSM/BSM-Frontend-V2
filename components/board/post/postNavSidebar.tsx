import styles from '../../../styles/board/post/post-nav-sidebar.module.css';
import Link from "next/link";
import { Post } from "../../../types/boardType";

interface PostNavSidebarProps {
    boardId: string,
    prevPost: Post | undefined,
    nextPost: Post | undefined
}

export const PostNavSidebar = ({
    boardId,
    prevPost,
    nextPost
}: PostNavSidebarProps) => (
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