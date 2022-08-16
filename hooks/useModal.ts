import { useRecoilState } from "recoil";
import { ModalState, modalState } from "../store/modal.store";

interface UseModal {
    openModal: (key: string, closeable?: boolean) => void;
    closeModal: (key: string) => void;
    closeAllModal: () => void;
}

export const useModal = (): UseModal => {
    const [modalList, setModalList] = useRecoilState(modalState);

    const openModal = (key: string, closeable?: boolean) => {
        if (modalList[key] && (closeable === undefined || modalList[key].closeable === closeable)) {
            return;
        }
        
        setModalList(prev => ({
            ...prev,
            [key]: {
                isOpen: true,
                closeable: closeable?? true
            }
        }));
    }

    const closeModal = (key: string) => {
        setModalList(prev => {
            const { [key]: exclude, ...modals } = prev;
            return modals;
        });
    }

    const closeAllModal = () => {
        const newModalList: ModalState = {};
        setModalList(prev => {
            Object.entries(prev).forEach(modal => {
                if (!modal[1].closeable) {
                    newModalList[modal[0]] = modal[1];
                }
            });
            return newModalList;
        });
    }

    return {
        openModal,
        closeModal,
        closeAllModal
    }
}