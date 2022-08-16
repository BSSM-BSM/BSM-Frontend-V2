import { atom } from "recoil";

export interface ModalState {
    [index: string]: {
        isOpen: boolean,
        closeable: boolean
    }
}

export const modalState = atom<ModalState>({
    key: 'modalState',
    default: {}
});