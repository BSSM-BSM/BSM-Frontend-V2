import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtom } from "jotai";
import { useModal } from "@/hooks/useModal";
import { modalState } from "@/store/modal.store";

interface ModalProps<T> {
  children?: ReactNode,
  id: string,
  type?: string,
  title?: string | ReactNode,
  menuList?: {
    name: string,
    element: ReactNode
  }[],
  onOpen?: (props: T) => void;
  onClose?: () => void;
  onSelectMenu?: (i: number) => void
}

const Modal = <T extends unknown>({
  children,
  id,
  type,
  title,
  menuList,
  onOpen,
  onClose,
  onSelectMenu
}: ModalProps<T>) => {
  const { closeModal, closeAllModal } = useModal();
  const [mounted, setMounted] = useState(false);
  const [modalList] = useAtom(modalState);
  const [menuIdx, setMenuIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (onOpen && modalList[id]) {
      onOpen(modalList[id].props as T);
    }

    if (onClose && !modalList[id]) {
      onClose();
    }
  }, [modalList, mounted]);

  return mounted
    ? createPortal(
      modalList[id] && <>
        <div className='modal-dim' onClick={closeAllModal}></div>
        <div className={`modal ${type ?? ''}`}>
          <p className="modal--title">
            {title}
          </p>
          {modalList[id].closeable && <div className="close_button" onClick={() => closeModal(id)}></div>}
          <div className="modal--content scroll-bar">
            <ul className="modal--menu">{
              menuList?.map((menu, i) => (
                <li
                  key={menu.name}
                  className={i === menuIdx ? 'active' : ''}
                  onClick={() => {
                    setMenuIdx(i);
                    onSelectMenu && onSelectMenu(i);
                  }}
                >
                  {menu.name}
                </li>
              ))
            }</ul>
            {menuList && menuList[menuIdx]?.element}
            {children}
          </div>
        </div>
      </>,
      document.querySelector('#modal-wrap') as HTMLElement)
    : <></>;
};

export default Modal;