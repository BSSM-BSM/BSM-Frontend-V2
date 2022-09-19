import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { boardAndPostIdState, postOpenState, postState } from '../../store/board.store';
import styles from '../../styles/board/board.module.css';
import { Category, DetailPost, Post } from "../../types/boardType";
import { elapsedTime, MilliSecondTime } from '../../utils/util';

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
    hit,
    totalComments,
    totalLikes
}: PostItemProps) => {
    const [post, setPost] = useRecoilState(postState);
    const [, setBoardAndPostId] = useRecoilState(boardAndPostIdState);
    const [, setPostOpen] = useRecoilState(postOpenState);
    const {ajax} = useAjax();

    const loadPost = () => {
        ajax<DetailPost>({
            method: HttpMethod.GET,
            url: `post/${boardId}/${id}`,
            callback(data) {
                setBoardAndPostId({
                    boardId,
                    postId: id
                });
                setPostOpen(true);
                setPost(data);
            },
            errorCallback() {
                setPost(null)
            },
        });
    }

    return (
        <li className={styles.post_item_wrap}>
            <div className={styles.post_item}>
                <div className={styles.total_comments}>{totalComments}</div>
                <div className='flex-main cols gap-05'>
                    <Link href={`/board/${boardId}/${id}`}>
                        <a className={styles.post_title}>{title}</a>
                    </Link>
                    <div className='rows space-between'>
                        <div className={styles.user_info}>
                            <img className='user-profile' src={`https://auth.bssm.kro.kr/resource/user/profile/profile_${user.code}.png`} onError={e => e.currentTarget.src = '/icons/profile_default.png'} alt='user profile' />
                            <span>{user.nickname}</span>
                        </div>
                        <div className={styles.post_info}>
                            {totalLikes !== 0 && <span className={styles.total_likes}>{totalLikes}</span>}
                            <span className={`${styles.post_hit} rows gap-05`}>
                                <span>{hit}</span>
                                <img src="/icons/view.svg" alt="viewers"/>
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
                <Link href={`/board/${boardId}/${id}`}>
                    <a className={`${styles.refresh} button-wrap`} onClick={loadPost}>
                        <img src="/icons/refresh.svg" alt="refresh post"/>
                    </a>
                </Link>
            }
        </li>
    );
}