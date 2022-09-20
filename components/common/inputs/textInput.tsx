import styles from '../../../styles/input.module.css';
import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import { useOverlay } from "../../../hooks/useOverlay";

interface TextInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    setCallback: Dispatch<SetStateAction<string>>,
    initial?: string,
    placeholder?: string,
    immediately?: boolean,
    inactive?: boolean,
    full?: boolean
}

export const TextInput = (props: TextInputProps) => {
    const {
        setCallback,
        initial = '',
        placeholder,
        type = 'text',
        pattern,
        className = '',
        immediately,
        full
    } = props;
    const [tempValue, setTempValue] = useState(initial);
    const { showToast } = useOverlay();
    
    const applyValue = (value?: string) => {
        if (pattern && !new RegExp(pattern).test(value || tempValue)) {
            showToast('정상적인 값이 아닙니다');
            return;
        }
        setCallback(value || tempValue);
    }

    return (
        <div className={`${styles.input_wrap} ${full? styles.full: ''}`}>
            <input
                {...props}
                className={`${styles.input} ${className}`}
                type={type}
                value={tempValue}
                onChange={(event) => {
                    setTempValue(event.target.value);
                    if (immediately) applyValue(event.target.value);
                }}
                placeholder=''
                onBlur={() => applyValue()}
                onKeyDown={e => e.key === 'Enter' && applyValue()}
            ></input>
            <span className={styles.placeholder}>{placeholder}</span>
        </div>
    );
}