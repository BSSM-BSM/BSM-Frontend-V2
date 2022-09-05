import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { toastState } from "../../../store/overlay.store";

const Toast = () => {
    const [mounted, setMounted] = useState(false);
    const [toastList] = useRecoilState(toastState);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    return mounted? createPortal(
        <div className="toast-wrap">{
            Object.values(toastList).map(toast => (
                <div key={toast.id} className={`toast ${toast.status}`}>{toast.content}</div>
            ))
        }</div>,
        document.querySelector('#overlay-wrap') as HTMLElement
    ): null;
};

export default Toast;