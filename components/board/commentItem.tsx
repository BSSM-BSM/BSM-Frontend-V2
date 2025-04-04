import { useRecoilState } from 'recoil';
import { parentCommentState } from '@/store/board.store';
import styles from '@/styles/board/comment.module.css';
import { BoardAndPostId, Comment, DeletedComment } from "@/types/board.type"
import DefaultProfilePic from '@/public/icons/profile_default.png';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import { FilterXSS } from 'xss';
import { UserInfoLink } from './userInfoLink';
import { getProfileSrc } from '@/utils/userUtil';
import { elapsedTime } from '@/utils/date';
import { DropdownMenu } from '@/components/common/dropdownMenu';
import { boardOpenAllChildCommentsState } from '@/store/setting/board.store';
import React from 'react';

export const CommentList = ({
  comment,
  loadComments,
  deleteComment,
  updateCommentNoRecordMode,
  boardDetailTime,
  commentXssFilter,
  boardAndPostId
}: {
  comment: Comment | DeletedComment,
  loadComments: Function,
  deleteComment: Function,
  updateCommentNoRecordMode: Function,
  boardDetailTime: boolean,
  commentXssFilter: FilterXSS,
  boardAndPostId: BoardAndPostId
}) => {
  const [, setParentComment] = useRecoilState(parentCommentState);
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(getProfileSrc(-1));
  const [boardOpenAllChildComments] = useRecoilState(boardOpenAllChildCommentsState);
  const [viewChild, setViewChild] = useState<boolean>(boardOpenAllChildComments || comment.depth < 4);
  const { boardId, postId } = boardAndPostId;

  useEffect(() => {
    setProfileSrc(getProfileSrc(!comment.delete ? comment.user.id : -1));
  }, [comment]);

  return (
    <div className='left'>
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
                        width='128'
                        height='128'
                        alt='user profile'
                      />
                    </div>
                  </div>
                  <div className='cols flex-main'>
                    <div className='rows space-between bold'>
                      <UserInfoLink userId={comment.user.id} nickname={comment.user.nickname} />
                      {
                        !comment.delete &&
                        comment.permission &&
                        <DropdownMenu
                          meatballsMenu={true}
                          menus={[
                            { text: '삭제', callback: () => deleteComment(comment.id) },
                            { text: '답글', callback: () => setParentComment(comment) },
                            { text: '익명으로 전환', callback: () => updateCommentNoRecordMode(comment.id) }
                          ]}
                        />
                      }
                    </div>
                    <div className='gray'>{
                      boardDetailTime
                        ? new Date(comment.createdAt).toLocaleString()
                        : elapsedTime(comment.createdAt)
                    }</div>
                  </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: commentXssFilter.process(comment.content) }}></div>
              </>
          }
        </div>
      </div>
      {
        comment.child &&
        <div className={styles.child}>
          {
            viewChild
              ? comment.child.map(child => (
                <CommentList
                  key={`${boardId}/${postId}/${child.id}`}
                  comment={child}
                  loadComments={loadComments}
                  deleteComment={deleteComment}
                  updateCommentNoRecordMode={updateCommentNoRecordMode}
                  boardDetailTime={boardDetailTime}
                  commentXssFilter={commentXssFilter}
                  boardAndPostId={boardAndPostId}
                />
              ))
              : <div onClick={() => setViewChild(true)} className={styles.view_child}>대댓글 더보기</div>
          }
        </div>
      }
    </div>
  );
}