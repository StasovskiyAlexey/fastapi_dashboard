import { axiosClient } from "@/api/client";
import type { TBoard, TCreateBoard, TUpdateBoard } from "@/types/kanban";
import type { TSuccessResponse } from "@/types/response";

class KanbanService {
  async getBoards(): Promise<TSuccessResponse<TBoard[]>> {
    return await axiosClient.get('/kanban/get_boards')
  }

  async getBoard(boardId: number): Promise<TSuccessResponse<TBoard>> {
    return await axiosClient.post('/kanban/get_board_by_id', {board_id: boardId })
  }

  async createBoard(data: TCreateBoard['data']): Promise<TSuccessResponse<TCreateBoard>> {
    return await axiosClient.post('/kanban/create_board', {title: data?.title})
  }

  async updateBoard(data: TUpdateBoard['data'], boardId: number): Promise<TSuccessResponse<TUpdateBoard>> {
    return await axiosClient.post('/kanban/update_board', {title: data?.title}, {
      params: {
        board_id: boardId
      }
    })
  }
}

export const kanbanService = new KanbanService()