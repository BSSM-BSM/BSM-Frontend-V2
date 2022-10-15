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
        <label className={`toggle-button ${value? 'active': ''}`} onClick={() => {
            if (!value) {
                onCallback();
            } else {
                offCallback();
            }
        }}>
            <div className="slider"></div>
        </label>
    );
}