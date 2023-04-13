import styles from '@/styles/board/post/post-nav-bar.module.css';
import Link from "next/link";
import { Post } from "@/types/board.type";

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
        <span>이전글</span>
        {prevPost.title}
      </Link>
    }
    {
      nextPost &&
      <Link href={`/board/${boardId}/${nextPost.id}`}>
        <span>다음글</span>
        {nextPost.title}
      </Link>
    }
  </div>
);