import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { useModal } from "../../hooks/useModal";
import { modalState } from "../../store/modal.store";

interface ModalProps {
    children?: ReactNode,
    id: string,
    type?: string,
    title?: string | ReactNode,
    menuList?: {
        name: string,
        element: ReactNode
    }[],
    callback?: Function
}

const Modal = ({
    children,
    id,
    type,
    title,
    menuList,
    callback
}: ModalProps) => {
    const { closeModal } = useModal();
    const [mounted, setMounted] = useState(false);
    const [modalList] = useRecoilState(modalState);
    const [menuIdx, setMenuIdx] = useState(0);

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
                    <ul className="modal--menu">{
                        menuList?.map((menu, i) => (
                            <li key={menu.name} className={i === menuIdx? 'active': ''} onClick={() => setMenuIdx(i)}>{menu.name}</li>
                        ))
                    }</ul>
                    {menuList && menuList[menuIdx]?.element}
                    {children}
                </div>
            </div>
        ),
        document.querySelector('#modal-wrap') as HTMLElement
    ): null;
};

export default Modal;