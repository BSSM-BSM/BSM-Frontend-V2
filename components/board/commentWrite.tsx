import styles from '../../styles/board/comment.module.css';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil"
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { boardAndPostIdState, parentCommentState } from "../../store/board.store"
import { EditorInput } from "../common/inputs/editorInput";

interface CommentWriteProps {
    loadComments: Function
}

export const CommentWrite = ({
    loadComments
}: CommentWriteProps) => {
    const {ajax} = useAjax();
    const [boardAndPostId] = useRecoilState(boardAndPostIdState);
    const {boardId, postId} = boardAndPostId;
    const [content, setContent] = useState<string | null>('');
    const [parentComment, setParentComment] = useRecoilState(parentCommentState);
    const { depth, id: parentId, user: {nickname} } = parentComment ?? { depth: -1, id: 0, user: {}};

    const writeComment = () => {
        ajax({
            method: HttpMethod.POST,
            url: `comment/${boardId}/${postId}`,
            payload: {
                depth: depth + 1,
                parentId,
                content,
                anonymous: false
            },
            callback() {
                setParentComment(null);
                setContent(null);
                loadComments();
            }
        });
    }

    useEffect(() => {
        return () => setParentComment(null);
    }, []);

    useEffect(() => {
        content === null && setContent('');
    }, [content]);

    return (
        <div className={styles.write_wrap}>
            {
                content !== null && 
                <EditorInput
                    setCallback={setContent}
                    placeholder={parentComment? `${nickname}에게 답글`: '댓글 내용'}
                    className='comment-input'
                />
            }
            {parentComment && <button className="button delete" onClick={() => setParentComment(null)}>취소</button>}
            <button className="button" onClick={writeComment}>쓰기</button>
        </div>
    );
}