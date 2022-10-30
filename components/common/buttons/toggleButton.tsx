import styles from '../../../styles/common/button.module.css';

interface ToggleButtonProps {
    onCallback: Function;
    offCallback: Function;
    value: boolean
}

export const ToggleButton = ({
    onCallback,
    offCallback,
    value
}: ToggleButtonProps) => {
    return (
        <label className={`${styles.toggle} ${value? styles.active: ''}`} onClick={() => !value? onCallback(): offCallback()}>
            <div className={styles.slider}></div>
        </label>
    );
}