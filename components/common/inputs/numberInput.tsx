import styles from '../../../styles/common/input.module.css';
import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, SetStateAction, useEffect, useState } from "react";
import { useOverlay } from "../../../hooks/useOverlay";
import { numberInBetween } from "../../../utils/util";

interface NumberInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    setCallback: Dispatch<SetStateAction<number>>,
    value?: number,
    initial?: number,
    min?: number,
    max?: number,
    msg?: string,
    immediately?: boolean,
    full?: boolean
}

export const NumberInput = (props: NumberInputProps) => {
    const {
        setCallback,
        value,
        initial = '',
        placeholder,
        type = 'number',
        min,
        max,
        msg,
        className = '',
        immediately,
        full
    } = props;
    const [tempValue, setTempValue] = useState<string>(String(initial));
    const { showToast } = useOverlay();

    useEffect(() => {
        if (value === undefined) return;
        setTempValue(String(value));
    }, [value]);
    
    const applyValue = (value?: string) => {
        if (!tempValue.length) return;
        if (!numberInBetween(min, max, Number(value) || Number(tempValue))) {
            showToast('정상적인 값이 아닙니다');
            return;
        }
        setCallback(Number(value) || Number(tempValue));
    }

    return (
        <div className='rows'>
            <div className={`${styles.input_wrap} ${styles.number} ${full? styles.full: ''}`}>
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
            <div className='cols center'>{msg}</div>
        </div>
    );
}