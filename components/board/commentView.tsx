import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { FilterXSS } from 'xss';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { boardAndPostIdState } from '../../store/board.store';
import styles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment } from "../../types/board.type"
import { renderEmoticon } from '../../utils/emoticon';
import { CommentList } from './commentItem';

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

  useEffect(() => {
    renderEmoticon();
  }, [commentList]);

  return (
    <div className={`${styles.comment_wrap} scroll-bar horizontal`}>
      {commentList.map(comment => (
        <CommentList
          key={`${boardId}/${postId}/${comment.id}`}
          comment={comment}
          loadComments={loadComments}
          deleteComment={deleteComment}
          boardDetailTime={boardDetailTime}
          commentXssFilter={commentXssFilter}
          boardAndPostId={boardAndPostId}
        />
      ))}
    </div>
  );
};