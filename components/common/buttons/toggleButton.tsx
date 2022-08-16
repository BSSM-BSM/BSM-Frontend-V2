import { useState } from "react";

interface ToggleButtonProps {
    onCallback: Function;
    offCallback: Function;
    initial: boolean
}

export const ToggleButton = (props: ToggleButtonProps) => {
    const [checked, setChecked] = useState(props.initial);
    
    return (
        <label className={`toggle-button ${checked? 'active': ''}`} onClick={() => {
            if (!checked) {
                props.onCallback();
            } else {
                props.offCallback();
            }
            setChecked(!checked);
        }}>
            <div className="slider"></div>
        </label>
    );
}