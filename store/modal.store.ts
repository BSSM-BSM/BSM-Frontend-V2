import { atom } from "jotai";

export interface ModalState {
  [index: string]: {
    isOpen: boolean,
    closeable: boolean
  }
}

export const modalState = atom<ModalState>({});