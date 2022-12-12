import styles from '../../../styles/board/post/post-nav-bar.module.css';
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
            <a>
                <span>이전글</span>
                {prevPost.title}
            </a>
            </Link>
        }
        {
            nextPost && 
            <Link href={`/board/${boardId}/${nextPost.id}`}>
            <a>
                <span>다음글</span>
                {nextPost.title}
            </a>
            </Link>
        }
    </div>
);