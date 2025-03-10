import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { FilterXSS } from 'xss';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { boardAndPostIdState } from '@/store/board.store';
import styles from '@/styles/board/comment.module.css';
import { Comment, DeletedComment } from "@/types/board.type"
import { renderEmoticon } from '@/utils/emoticon';
import { CommentList } from '@/components/board/commentItem';
import { useInterval } from '../../hooks/useInterval';

const commentXssFilter = new FilterXSS({
  whiteList: {
    img: ['e_id', 'e_idx', 'e_type']
  }
});

export const CommentView = ({
  commentList,
  loadComments,
  boardDetailTime
}: {
  commentList: (Comment | DeletedComment)[],
  loadComments: Function,
  boardDetailTime: boolean
}) => {
  const { ajax } = useAjax();
  const [boardAndPostId] = useRecoilState(boardAndPostIdState);
  const { boardId, postId } = boardAndPostId;

  const deleteComment = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const [, error] = await ajax({
      url: `comment/${boardId}/${postId}/${id}`,
      method: HttpMethod.DELETE,
    });
    if (error) return;

    loadComments();
  }

  const updateCommentNoRecordMode = async (id: number) => {
    if (!confirm('정말 익명으로 변경하시겠습니까?')) return;
    const [, error] = await ajax({
      url: `comment/${boardId}/${postId}/${id}/no-record`,
      method: HttpMethod.PUT,
    });
    if (error) return;

    loadComments();
  }

  useEffect(renderEmoticon);
  useInterval(renderEmoticon, 100);

  return (
    <div className={`${styles.comment_wrap} scroll-bar horizontal`}>
      {commentList.map(comment => (
        <CommentList
          key={`${boardId}/${postId}/${comment.id}`}
          comment={comment}
          loadComments={loadComments}
          deleteComment={deleteComment}
          updateCommentNoRecordMode={updateCommentNoRecordMode}
          boardDetailTime={boardDetailTime}
          commentXssFilter={commentXssFilter}
          boardAndPostId={boardAndPostId}
        />
      ))}
    </div>
  );
};