import { atom } from "jotai";

export interface ModalState {
  [index: string]: {
    isOpen: boolean,
    closeable: boolean,
    props?: unknown
  }
}

export const modalState = atom<ModalState>({});
