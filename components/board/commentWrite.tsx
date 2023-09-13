import styles from '@/styles/board/comment.module.css';
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil"
import { HttpMethod, useAjax } from "@/hooks/useAjax";
import { boardActiveEditorState, boardAndPostIdState, parentCommentState } from "@/store/board.store"
import { EditorInput } from "@/components/common/inputs/editorInput";
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/common/buttons/button';
import { boardAnonymousModeState, boardNoRecordModeState } from '@/store/setting/board.store';
import { AnonymousType } from '@/types/board.type';

interface CommentWriteProps {
  loadComments: Function
}

export const CommentWrite = ({
  loadComments
}: CommentWriteProps) => {
  const { ajax } = useAjax();
  const { openModal } = useModal();
  const boardAnonymousMode = useRecoilValue(boardAnonymousModeState);
  const boardNoRecordMode = useRecoilValue(boardNoRecordModeState);
  const [boardAndPostId] = useRecoilState(boardAndPostIdState);
  const { boardId, postId } = boardAndPostId;
  const [content, setContent] = useState<string | null>('');
  const [parentComment, setParentComment] = useRecoilState(parentCommentState);
  const { depth, id: parentId, user: { nickname } } = parentComment ?? { depth: -1, id: 0, user: {} };
  const [, setActiveEditor] = useRecoilState(boardActiveEditorState);

  const writeComment = async () => {
    if (!confirm('익명 댓글은 수정할 수 없습니다!\n정말 익명으로 작성하시겠습니까?')) return;
    const [, error] = await ajax({
      method: HttpMethod.POST,
      url: 'comment',
      payload: {
        boardId,
        postId,
        depth: depth + 1,
        parentId,
        content,
        anonymous: boardNoRecordMode ? AnonymousType.NO_RECORD : boardAnonymousMode ? AnonymousType.INVISIBLE : AnonymousType.VISIBLE
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
            <span>{boardNoRecordMode ? '(익명)' : boardAnonymousMode ? '(닉네임 숨김)' : '(닉네임 표시)'}</span>
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