import styles from '../../../styles/input.module.css';
import { KeyboardEvent, ClipboardEvent, Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import ContentEditable from 'react-contenteditable';

interface EditorInputProps {
    setCallback: Dispatch<SetStateAction<string | null>>,
    className?: string,
    initial?: string,
    placeholder?: string,
    immediately?: boolean,
    inactive?: boolean,
    full?: boolean,
    refCallback?: (ref: RefObject<HTMLDivElement>) => void
}

export const EditorInput = (props: EditorInputProps) => {
    const {
        setCallback,
        initial = '',
        placeholder,
        className = '',
        immediately,
        full,
        refCallback
    } = props;
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;
        contentRef.current.innerHTML = initial;
        refCallback && refCallback(contentRef);
    }, []);
    
    const applyValue = (value?: string) => {
        if (!contentRef.current?.innerHTML.length) {
            return;
        }
        setCallback(value ?? contentRef.current?.innerHTML ?? '');
    }

    const editorHandler = (event: KeyboardEvent) => {
        /*
        브라우저에서 contenteditable 속성이 다음 줄을 \n문자를 집어넣어서 개행처리를 하지않고
        <div><br></div>로 개행처리를 해서 댓글에 태그가 그대로 남는 문제 발생
        이벤트를 가로채서 대신 \n을 집어넣게 만들기로함
        document.execCommand는 더 이상 표준이 아니기 때문에 입력 커서를 조작하는 식으로 해결
        */
        // 키 입력이 엔터라면
        if (event.key === 'Enter') {
            event.preventDefault();
            const selection = window.getSelection();
            if (!selection) return;
            selection.deleteFromDocument();
            const range = selection.getRangeAt(0);
            const newline = document.createTextNode('\n');

            range.insertNode(newline);
            range.setStartAfter(newline);
            range.setEndAfter(newline);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        applyValue();
    }

    const pasteHandler = (event: ClipboardEvent) => {
        event.preventDefault();
        const data = (event.nativeEvent ?? event).clipboardData?.getData('text/plain');
        const selection = window.getSelection();
        if (!data || !selection?.rangeCount) return;
        selection.deleteFromDocument();
        const range = selection.getRangeAt(0);
        const text = document.createTextNode(data);

        range.insertNode(text);
        range.setStartAfter(text);
        range.setEndAfter(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    return (
        <div className={`${styles.input_wrap} ${styles.editor} ${full? styles.full: ''}`}>
            <ContentEditable
                innerRef={contentRef}
                html={contentRef.current?.innerHTML ?? ''}
                disabled={false}
                className={`${styles.input} ${contentRef.current?.innerHTML.length? styles.active: ''} ${className}`}
                onChange={() => {}}
                onBlur={() => applyValue()}
                onKeyDown={editorHandler}
                onPaste={pasteHandler}
            />
            <span className={styles.placeholder}>{placeholder}</span>
        </div>
    );
}