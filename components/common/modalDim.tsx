import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import { useModal } from "../../hooks/useModal";
import { modalState } from "../../store/modal.store";

const ModalDim = () => {
    const { closeAllModal } = useModal();
    const [mounted, setMounted] = useState(false);
    const [modalList] = useRecoilState(modalState);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    return mounted? createPortal(
        Object.keys(modalList).length? (
            <div className='dim' onClick={closeAllModal}></div>
        ): null,
        document.querySelector('#modal-wrap') as HTMLElement
    ): null;
};

export default ModalDim;