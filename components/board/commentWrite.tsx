import styles from '../../styles/board/comment.module.css';
import { useState } from "react";
import { useRecoilState } from "recoil"
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { boardAndPostIdState } from "../../store/board.store"
import { EditorInput } from "../common/inputs/editorInput";

interface CommentWriteProps {
    depth: number,
    parentId: number,
    loadComments: Function
}

export const CommentWrite = ({
    depth,
    parentId,
    loadComments
}: CommentWriteProps) => {
    const {ajax} = useAjax();
    const [boardAndPostId] = useRecoilState(boardAndPostIdState);
    const {boardId, postId} = boardAndPostId;
    const [content, setContent] = useState<string>('');

    const writeComment = () => {
        ajax({
            method: HttpMethod.POST,
            url: `comment/${boardId}/${postId}`,
            payload: {
                depth,
                parentId,
                content,
                anonymous: false
            },
            callback() {
                setContent('');
                loadComments();
            }
        });
    }

    return (
        <div className={styles.write_wrap}>
            <EditorInput
                setCallback={setContent}
                placeholder='댓글 내용'
                className='comment-input'
            />
            <button className="button" onClick={writeComment}>쓰기</button>
        </div>
    );
}