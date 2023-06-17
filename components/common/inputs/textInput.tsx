import styles from '@/styles/common/input.module.css';
import { DetailedHTMLProps, Dispatch, InputHTMLAttributes, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useOverlay } from "@/hooks/useOverlay";

interface TextInputProps extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'placeholder'> {
  setCallback: Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<string | undefined>>,
  initial?: string,
  placeholder?: string | ReactNode,
  immediately?: boolean,
  inactive?: boolean,
  full?: boolean
}

export const TextInput = (props: TextInputProps) => {
  const {
    value,
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

  useEffect(() => {
    typeof value === 'string' && setTempValue(value);
  }, [value]);

  const applyValue = (value?: string) => {
    if (pattern && !new RegExp(pattern).test(value || tempValue)) {
      showToast('정상적인 값이 아닙니다');
      return;
    }
    setCallback(value || tempValue);
  }

  return (
    <div className={`${styles.input_wrap} ${full ? styles.full : ''}`}>
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
      {placeholder && <span className={styles.placeholder}>{placeholder}</span>}
    </div>
  );
}