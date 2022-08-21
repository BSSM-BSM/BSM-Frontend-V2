import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { useModal } from "../../hooks/useModal";
import { modalState } from "../../store/modal.store";

interface ModalProps {
    children: ReactNode,
    id: string,
    type?: string,
    title?: string | ReactNode,
    callback?: Function
}

const Modal = ({
    children,
    id,
    type,
    title,
    callback
}: ModalProps) => {
    const { closeModal } = useModal();
    const [mounted, setMounted] = useState(false);
    const [modalList] = useRecoilState(modalState);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!callback || !mounted || !modalList[id]) return;
        callback();
    }, [modalList]);
    
    return mounted? createPortal(
        modalList[id] && (
            <div className={`modal ${type?? ''}`}>
                <p className="modal--title">
                    {title}
                </p>
                {modalList[id].closeable && <div className="close_button" onClick={() => closeModal(id)}></div>}
                <div className="modal--content">
                    {children}
                </div>
            </div>
        ),
        document.querySelector('#modal-wrap') as HTMLElement
    ): null;
};

export default Modal;