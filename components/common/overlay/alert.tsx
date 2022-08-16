import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { alertState } from "../../../store/overlay.store";

const Alert = () => {
    const [mounted, setMounted] = useState(false);
    const [alert] = useRecoilState(alertState);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    return mounted? createPortal(
        <div className="alert-wrap">{
            alert.msg !== null && <div className={`alert ${alert.status}`}>{alert.msg}</div>
        }</div>,
        document.querySelector('#overlay-wrap') as HTMLElement
    ): null;
};

export default Alert;