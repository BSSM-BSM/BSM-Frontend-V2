import styles from '@/styles/board/comment.module.css';
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil"
import { HttpMethod, useAjax } from "@/hooks/useAjax";
import { boardActiveEditorState, boardAndPostIdState, parentCommentState } from "@/store/board.store"
import { EditorInput } from "@/components/common/inputs/editorInput";
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/common/buttons/button';
import { boardAnonymousModeState } from '@/store/setting/board.store';

interface CommentWriteProps {
  loadComments: Function
}

export const CommentWrite = ({
  loadComments
}: CommentWriteProps) => {
  const { ajax } = useAjax();
  const { openModal } = useModal();
  const [boardAnonymousMode, setBoardAnonymousMode] = useRecoilState(boardAnonymousModeState);
  const [boardAndPostId] = useRecoilState(boardAndPostIdState);
  const { boardId, postId } = boardAndPostId;
  const [content, setContent] = useState<string | null>('');
  const [parentComment, setParentComment] = useRecoilState(parentCommentState);
  const { depth, id: parentId, user: { nickname } } = parentComment ?? { depth: -1, id: 0, user: {} };
  const [, setActiveEditor] = useRecoilState(boardActiveEditorState);

  const writeComment = async () => {
    const [, error] = await ajax({
      method: HttpMethod.POST,
      url: 'comment',
      payload: {
        boardId,
        postId,
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
          placeholder={<>
            <span>{parentComment ? `${nickname}에게 답글` : '댓글'}</span>
            <label className='rows gap-05'>
              <span>익명</span>
              <input type="checkbox" checked={boardAnonymousMode} onChange={e => setBoardAnonymousMode(e.target.checked)} />
            </label>
          </>}
          className='comment-input scroll-bar'
          refCallback={setActiveEditor}
        />
      }
      <div className={styles.write_bar_menu}>
        {parentComment && <Button className='delete' onClick={() => setParentComment(null)}>취소</Button>}
        <Button className={styles.emoticon_button} onClick={() => openModal('emoticon')}><img src='/icons/emoticon.svg' alt='emoticon' /></Button>
        <Button onClick={writeComment}>쓰기</Button>
      </div>
    </div>
  );
}