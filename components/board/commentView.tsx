import styles from '../../styles/board/comment.module.css';
import { Comment, DeletedComment } from "../../types/boardType"
import { CommentList } from './commentItem';

export const CommentView = ({commentList}: {commentList: (Comment | DeletedComment)[]}) => (
    <div className={styles.comment_wrap}>
        {<CommentList commentList={commentList} />}
    </div>
)