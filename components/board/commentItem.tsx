import { useRecoilState } from 'recoil';
import { boardOpenAllChildCommentsState, parentCommentState } from '../../store/board.store';
import styles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment } from "../../types/boardType"
import { elapsedTime } from '../../utils/util';
import DefaultProfilePic from '../../public/icons/profile_default.png';
import Image, { StaticImageData } from 'next/image';
import { getProfileSrc } from '../../utils/util';
import { useState } from 'react';
import { FilterXSS } from 'xss';

export const CommentList = ({
    comment,
    loadComments,
    deleteComment,
    boardDetailTime,
    commentXssFilter
}: {
    comment: Comment | DeletedComment,
    loadComments: Function,
    deleteComment: Function,
    boardDetailTime: boolean,
    commentXssFilter: FilterXSS
}) => {
    const [, setParentComment] = useRecoilState(parentCommentState);
    const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(getProfileSrc(!comment.delete? comment.user.code: -1));
    const [boardOpenAllChildComments] = useRecoilState(boardOpenAllChildCommentsState);
    const [viewChild, setViewChild] = useState<boolean>(boardOpenAllChildComments || comment.depth < 4);
    
    return (
        <ul className='left'>
            <li key={comment.id}>
                <div className={styles.item_wrap}>
                    <div className={styles.item} onClick={() => !comment.delete && setParentComment(comment)}>
                        {
                            comment.delete
                            ? <span className={styles.deleted}>삭제된 댓글 입니다</span>
                            : <>
                                <div className='rows gap-1'>
                                    <div className='cols center'>
                                    <div className={`user-profile ${styles.user_profile}`}>
                                        <Image
                                            src={profileSrc}
                                            onError={() => setProfileSrc(DefaultProfilePic)}
                                            width='128px'
                                            height='128px'
                                            alt='user profile'
                                        />
                                    </div>
                                    </div>
                                    <div className='cols flex-main'>
                                        <div className='rows space-between bold'>
                                            <span>{comment.user.nickname}</span>
                                        </div>
                                        <div className='gray'>{
                                            boardDetailTime
                                            ? new Date(comment.createdAt).toLocaleString()
                                            : elapsedTime(comment.createdAt)
                                        }</div>
                                    </div>
                                </div>
                                <div dangerouslySetInnerHTML={{__html: commentXssFilter.process(comment.content)}}></div>
                            </>
                        }
                    </div>
                    {
                        !comment.delete && 
                        comment.permission && 
                        <div className='left-slide-menu'>
                            <span className='menu-button'>
                                <span className='line'></span>
                                <span className='line'></span>
                                <span className='line'></span>
                            </span>
                            <ul className='menu-list'>
                                <li>
                                    <button className='button delete' onClick={() => deleteComment(comment.id)}>삭제</button>
                                </li>
                            </ul>
                        </div>
                    }
                </div>
                {
                    comment.child &&
                    <div className={styles.child}>
                        {
                            viewChild
                            ? comment.child.map(child => (
                                <CommentList
                                    key={child.id}
                                    comment={child}
                                    loadComments={loadComments}
                                    deleteComment={deleteComment}
                                    boardDetailTime={boardDetailTime}
                                    commentXssFilter={commentXssFilter}
                                />
                            ))
                            : <div onClick={() => setViewChild(true)} className={styles.view_child}>대댓글 더보기</div>
                        }
                    </div>
                }
            </li>
        </ul>
    )
}