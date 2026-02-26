import { create } from "zustand";

export type TModals = {
  isOpenUpdateBoard: any,
  isOpenUpdateAvatar: any
  isOpenCreateBoard: any,
  isOpenConfirmModal: any,
  isOpenCreateColumn: any,
  isOpenUpdateColumn: any,
  isOpenCreateCard: any,
  isOpenUpdateCard: any
}

export type TModalStore = {
  modals: {[K in keyof TModals]: {
    isOpen: boolean,
    data: any | null
  }}
  switcher:<K extends keyof TModals> (modal: K, isOpen: boolean, data?: TModals[K]) => void
}

const useModalStore = create<TModalStore>((set) => ({
  modals: {
    isOpenUpdateBoard: {isOpen: false, data: null},
    isOpenUpdateAvatar: {isOpen: false, data: null},
    isOpenCreateBoard: {isOpen: false, data: null},
    isOpenConfirmModal: {isOpen: false, data: null},
    isOpenCreateColumn: {isOpen: false, data: null},
    isOpenUpdateColumn: {isOpen: false, data: null},
    isOpenCreateCard: {isOpen: false, data: null},
    isOpenUpdateCard: {isOpen: false, data: null},
  },

  switcher: (modal, isOpen, data) => set((state) => ({
    modals: {
      ...state.modals, [modal]: {isOpen, data}
    }
  }))
}))

export default useModalStore