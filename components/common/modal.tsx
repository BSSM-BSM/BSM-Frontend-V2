import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { useModal } from "../../hooks/useModal";
import { modalState } from "../../store/modal.store";

interface ModalProps {
    children: ReactNode,
    id: string,
    type?: string,
    title?: string | ReactNode
}

const Modal = ({
    children,
    id,
    type,
    title
}: ModalProps) => {
    const { closeModal } = useModal();
    const [mounted, setMounted] = useState(false);
    const [modalList] = useRecoilState(modalState);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
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