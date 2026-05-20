import { useAtom } from "jotai";
import { ModalState, modalState } from "@/store/modal.store";

interface UseModal {
  openModal: ({ key, closeable }: { key: string, closeable?: boolean }, props?: unknown) => void;
  closeModal: (key: string) => void;
  closeAllModal: () => void;
}

export const useModal = (): UseModal => {
  const [modalList, setModalList] = useAtom(modalState);

  const openModal: UseModal['openModal'] = ({ key, closeable }, props) => {
    if (modalList[key] && (closeable === undefined || modalList[key].closeable === closeable)) {
      return;
    }

    setModalList(prev => ({
      ...prev,
      [key]: {
        isOpen: true,
        closeable: closeable ?? true,
        props
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