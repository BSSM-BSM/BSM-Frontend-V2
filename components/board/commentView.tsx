import styles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment } from "../../types/boardType"
import { CommentList } from './commentItem';

export const CommentView = ({
    commentList,
    loadComments
}: {
    commentList: (Comment | DeletedComment)[],
    loadComments: Function
}) => (
    <div className={styles.comment_wrap}>
        {<CommentList commentList={commentList} loadComments={loadComments} />}
    </div>
)