import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { boardAndPostIdState, postOpenState, postState } from '../../store/board.store';
import styles from '../../styles/board/board.module.css';
import { Category, DetailPost, Post } from "../../types/board.type";
import DefaultProfilePic from '../../public/icons/profile_default.png';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';
import { UserInfoLink } from './userInfoLink';
import { elapsedTime, MilliSecondTime } from '../../utils/date';
import { getProfileSrc } from '../../utils/userUtil';

interface PostItemProps extends Post {
  boardId: string,
  categoryList: {
    [index: string]: Category
  }
}

export const PostItem = ({
  boardId,
  categoryList,
  id,
  user,
  category,
  title,
  createdAt,
  view,
  totalComments,
  totalLikes
}: PostItemProps) => {
  const [post, setPost] = useRecoilState(postState);
  const [, setBoardAndPostId] = useRecoilState(boardAndPostIdState);
  const [, setPostOpen] = useRecoilState(postOpenState);
  const { ajax } = useAjax();
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(getProfileSrc(user.code));

  const loadPost = async () => {
    const [data, error] = await ajax<DetailPost>({
      method: HttpMethod.GET,
      url: `post/${boardId}/${id}`,
      errorCallback() {
        setPost(null)
      },
    });
    if (error) return;

    setBoardAndPostId({
      boardId,
      postId: id
    });
    setPostOpen(true);
    setPost(data);
  }

  return (
    <li className={styles.post_item_wrap}>
      <div className={styles.post_item}>
        <div className={styles.total_comments}>{totalComments}</div>
        <div className='flex-main cols gap-05'>
          <Link
            href={`/board/${boardId}/${id}`}
            className={styles.post_title}
          >
            {title}
          </Link>
          <div className='rows space-between'>
            <div className={styles.user_info}>
              <div className='user-profile'>
                <Image
                  src={profileSrc}
                  onError={() => setProfileSrc(DefaultProfilePic)}
                  width='128'
                  height='128'
                  alt='user profile'
                />
              </div>
              <UserInfoLink userCode={user.code} nickname={user.nickname} />
            </div>
            <div className={styles.post_info}>
              {totalLikes !== 0 && <span className={styles.total_likes}>{totalLikes}</span>}
              <span className={`${styles.post_hit} rows gap-05`}>
                <span>{view}</span>
                <img src="/icons/view.svg" alt="viewers" />
              </span>
              {category !== null && <span>{categoryList[category]?.name}</span>}
              <span className={styles.post_date}>{
                elapsedTime(createdAt, MilliSecondTime.MONTH) || new Date(createdAt).toLocaleDateString()
              }</span>
            </div>
          </div>
        </div>
      </div>
      {
        post?.id === id &&
        <Link
          href={`/board/${boardId}/${id}`}
          className={`${styles.refresh} button-wrap`}
          onClick={loadPost}
        >
          <img src="/icons/refresh.svg" alt="refresh post" />
        </Link>
      }
    </li>
  );
}