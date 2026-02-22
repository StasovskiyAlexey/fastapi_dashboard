import { kanbanService } from "@/services/kanban.service";
import type { TBoard, TCreateBoard, TUpdateBoard } from "@/types/kanban";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";

interface IKanbanStore {
  loading: boolean
  boards: TBoard[] | null
  board: TBoard | null

  getBoards: () => Promise<TBoard[] | null | undefined>
  getBoard: (boardId: number) => Promise<TBoard | undefined>
  createBoard: (data: TCreateBoard["data"]) => Promise<TCreateBoard | undefined>
  updateBoard: (
    data: TUpdateBoard["data"],
    boardId: number
  ) => Promise<TUpdateBoard | undefined>
}

const useKanbanStore = create<IKanbanStore>((set) => ({
  loading: false,
  boards: null,
  board: null,

  getBoards: async () => {
    set({loading: true})
    try {
      const res = await kanbanService.getBoards()
      set({ boards: res.data })
      console.log(res)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  },

  getBoard: async (boardId) => {
    set({loading: true})
    try {
      const res = await kanbanService.getBoard(boardId)
      set({ board: res.data })
      toast.success(res.message)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  },

  createBoard: async (data) => {
    set({loading: true})
    try {
      const res = await kanbanService.createBoard(data)
      toast.success(res.message)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  },

  updateBoard: async (data: TUpdateBoard['data'], boardId) => {
    set({loading: true})
    try {
      const res = await kanbanService.updateBoard(data, boardId)
      toast.success(res.message)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  }
}))

export default useKanbanStore