import styles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment } from "../../types/boardType"
import { CommentWrite } from './commentWrite';

export const CommentList = ({
    commentList,
    loadComments
}: {
    commentList: (Comment | DeletedComment)[],
    loadComments: Function
}) => {
    return (
        <ul className='left'>{
            commentList.map(comment => (
                <li key={comment.id}>
                    <div className={styles.item}>
                        {
                            comment.delete
                            ? '삭제된 댓글 입니다'
                            : <>
                                <div className='rows gap-1'>
                                    <div className='cols center'>
                                        <img className={`user-profile ${styles.user_profile}`} src={`https://auth.bssm.kro.kr/resource/user/profile/profile_${comment.user.code}.png`} onError={e => e.currentTarget.src = '/icons/profile_default.png'} alt='user profile' />
                                    </div>
                                    <div className='cols flex-main'>
                                        <div className='rows space-between bold'>
                                            <span>{comment.user.nickname}</span>
                                            {comment.permission && <span>삭제</span>}
                                        </div>
                                        <div>{new Date(comment.createdAt).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div dangerouslySetInnerHTML={{__html: comment.content}}></div>
                            </>
                        }
                    </div>
                    <CommentWrite depth={comment.depth+1} parentId={comment.id} loadComments={loadComments} />
                    <div className={styles.child}>
                        {comment.child && <CommentList commentList={comment.child} loadComments={loadComments} />}
                    </div>
                </li>
            ))
        }</ul>
    )
}