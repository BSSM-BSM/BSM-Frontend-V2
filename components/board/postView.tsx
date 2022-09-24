import styles from '../../styles/board/post.module.css';
import commentStyles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment, DetailPost } from "../../types/boardType";
import { CommentView } from './commentView';
import { CommentWrite } from './commentWrite';
import Link from 'next/link';

export const PostView = ({
    boardId,
    post,
    commentList,
    loadComments
}: {
    boardId: string,
    post: DetailPost,
    commentList: (Comment | DeletedComment)[],
    loadComments: Function
}) => {

    return (
        <div className='container _110'>
            <div className={styles.post_wrap}>
                <Link href={`/board/${boardId}/write/${post.id}`}>
                    <a className='button'>글 수정</a>
                </Link>
                <div className={styles.post_info}>
                    <img className={`user-profile ${styles.user_profile}`} src={`https://auth.bssm.kro.kr/resource/user/profile/profile_${post.user.code}.png`} onError={e => e.currentTarget.src = '/icons/profile_default.png'} alt='user profile' />
                    <div className='cols space-between flex-main'>
                        <h2 className={styles.title}>{post.title}</h2>
                        <div className='rows space-between'>
                            <span className='bold'>{post.user.nickname}</span>
                            <div className='rows gap-2'>
                                <span>{post.totalComments} 댓글</span>
                                <span>조회 {post.hit}</span>
                                <span>{new Date(post.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.post_content} dangerouslySetInnerHTML={{__html: post.content}} />
            </div>
            <CommentView commentList={commentList} loadComments={loadComments} />
            <div className={`${commentStyles.write_bar} container _110`}>
                <CommentWrite loadComments={loadComments} />
            </div>
        </div>
    );
}