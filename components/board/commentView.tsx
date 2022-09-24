import styles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment } from "../../types/boardType"
import { CommentList } from './commentItem';

export const CommentView = ({
    commentList,
    loadComments,
    boardDetailTime
}: {
    commentList: (Comment | DeletedComment)[],
    loadComments: Function,
    boardDetailTime: boolean
}) => (
    <div className={styles.comment_wrap}>
        {<CommentList commentList={commentList} loadComments={loadComments} boardDetailTime={boardDetailTime} />}
    </div>
)