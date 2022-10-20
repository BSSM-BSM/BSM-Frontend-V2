import styles from '../../styles/board/comment.module.css';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil"
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { boardActiveEditorState, boardAndPostIdState, boardAnonymousModeState, parentCommentState } from "../../store/board.store"
import { EditorInput } from "../common/inputs/editorInput";
import { useModal } from '../../hooks/useModal';

interface CommentWriteProps {
    loadComments: Function
}

export const CommentWrite = ({
    loadComments
}: CommentWriteProps) => {
    const {ajax} = useAjax();
    const {openModal} = useModal();
    const [boardAnonymousMode] = useRecoilState(boardAnonymousModeState);
    const [boardAndPostId] = useRecoilState(boardAndPostIdState);
    const {boardId, postId} = boardAndPostId;
    const [content, setContent] = useState<string | null>('');
    const [parentComment, setParentComment] = useRecoilState(parentCommentState);
    const { depth, id: parentId, user: {nickname} } = parentComment ?? { depth: -1, id: 0, user: {}};
    const [, setActiveEditor] = useRecoilState(boardActiveEditorState);

    const writeComment = async () => {
        const [, error] = await ajax({
            method: HttpMethod.POST,
            url: `comment/${boardId}/${postId}`,
            payload: {
                depth: depth + 1,
                parentId,
                content,
                anonymous: boardAnonymousMode
            }
        });
        if (error) return;

        setParentComment(null);
        setContent(null);
        loadComments();
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
                    refCallback={setActiveEditor}
                />
            }
            <div className={styles.write_bar_menu}>
                {parentComment && <button className='button delete' onClick={() => setParentComment(null)}>취소</button>}
                <button className={`button ${styles.emoticon_button}`} onClick={() => openModal('emoticon')}><img src='/icons/emoticon.svg' alt='emoticon' /></button>
                <button className='button' onClick={writeComment}>쓰기</button>
            </div>
        </div>
    );
}