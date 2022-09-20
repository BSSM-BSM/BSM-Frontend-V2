import styles from '../../../styles/input.module.css';
import { Dispatch, SetStateAction, useRef } from "react";
import ContentEditable from 'react-contenteditable';

interface EditorInputProps {
    setCallback: Dispatch<SetStateAction<string | null>>,
    className?: string,
    initial?: string,
    placeholder?: string,
    immediately?: boolean,
    inactive?: boolean,
    full?: boolean
}

export const EditorInput = (props: EditorInputProps) => {
    const {
        setCallback,
        initial = '',
        placeholder,
        className = '',
        immediately,
        full
    } = props;
    const content = useRef(initial);
    
    const applyValue = (value?: string) => {
        if (!content.current.length) {
            return;
        }
        setCallback(value ?? content.current);
    }

    return (
        <div className={`${styles.input_wrap} ${styles.editor} ${full? styles.full: ''}`}>
            <ContentEditable
                html={content.current}
                disabled={false}
                className={`${styles.input} ${content.current.length? styles.active: ''} ${className}`}
                onChange={(event) => {
                    content.current = event.target.value;
                    if (immediately) applyValue(event.target.value);
                }}
                onBlur={() => applyValue()}
                onKeyDown={e => e.key === 'Enter' && applyValue()}
            />
            <span className={styles.placeholder}>{placeholder}</span>
        </div>
    );
}