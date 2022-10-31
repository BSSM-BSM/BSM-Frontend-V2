import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import styles from '../../../styles/common/button.module.css';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children?: ReactNode,
    onClick?: () => void,
    full?: boolean
}

export const Button = (props: ButtonProps) => {
    const {
        type = 'button',
        children,
        onClick,
        className = '',
        full
    } = props;
    
    return (
        <button
            {...props}
            type={type}
            className={`${styles.button} ${className} ${full? styles.full: ''}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}