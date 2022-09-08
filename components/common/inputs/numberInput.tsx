import { memo, useEffect, useState } from "react";
import { useOverlay } from "../../../hooks/useOverlay";
import { numberInBetween } from "../../../utils/util";

interface NumberInputProps {
    setCallback: Function,
    initial: number,
    min?: number,
    max?: number,
    msg?: string,
    immediately?: boolean
}

export const NumberInput = memo(({
    setCallback,
    initial,
    min,
    max,
    msg,
    immediately
}: NumberInputProps) => {
    const [tempValue, setTempValue] = useState(initial);
    const { showToast } = useOverlay();
    
    const applyValue = (value?: number) => {
        if (!numberInBetween(min, max, value || tempValue)) {
            showToast('정상적인 값이 아닙니다');
            return;
        }
        setCallback(value || tempValue);
    }

    return (
        <label>
            <input
                className="input-text"
                type="number"
                min={50}
                max={500}
                value={tempValue}
                onChange={(event) => {
                    setTempValue(Number(event.target.value));
                    if (immediately) applyValue(Number(event.target.value));
                }}
                onBlur={() => applyValue()}
                onKeyDown={e => e.key === 'Enter' && applyValue()}
            ></input>
            <span>{msg}</span>
        </label>
    );
})