import { axiosClient } from "@/api/client";
import type { TBoard, TCard, TColumn, TUpdateBoard } from "@/types/kanban";
import type { TSuccessResponse } from "@/types/response";

class KanbanService {
  async getBoards(): Promise<TSuccessResponse<TBoard[]>> {
    return await axiosClient.get('/kanban/get_boards')
  }

  async getBoard(boardId?: number): Promise<TSuccessResponse<TBoard>> {
    return await axiosClient.get('/kanban/get_board_by_id', {
      params: {
        board_id: boardId
      }
    })
  }

  async createBoard({data}: {data: {title: string}}): Promise<TSuccessResponse<TBoard>> {
    return await axiosClient.post('/kanban/create_board', {title: data?.title})
  }

  async updateBoard({data, boardId}: {data: {title: string}, boardId?: number}): Promise<TSuccessResponse<TUpdateBoard>> {
    return await axiosClient.patch('/kanban/update_board', {title: data?.title}, {
      params: {
        board_id: boardId
      }
    })
  }

  async deleteBoard(boardId: number): Promise<TSuccessResponse<TBoard>> {
    return await axiosClient.delete('/kanban/delete_board', {params: {board_id: boardId}})
  }
  

  async getColumns(boardId?: number): Promise<TSuccessResponse<TColumn[]>> {
    return await axiosClient.get('/kanban/get_columns', {
      params: {
        board_id: boardId
      }
    })
  }

  async getColumn(boardId?: number, columnId?: number): Promise<TSuccessResponse<TColumn>> {
    return await axiosClient.get('/kanban/get_column_by_id', {
      params: {
        board_id: boardId,
        column_id: columnId
      }
    })
  }

  async createColumn(title: string, boardId: number): Promise<TSuccessResponse<TColumn>> {
    return await axiosClient.post('/kanban/create_column', {title, board_id: boardId})
  }

  async updateColumn(title: string, order: number, columnId: number, boardId: number): Promise<TSuccessResponse<TColumn>> {
    return await axiosClient.patch('/kanban/update_column', {title, order}, {
      params: {
        column_id: columnId,
        board_id: boardId
      }
    })
  }

  async reorderColumns(boardId: number, columns: TColumn[]): Promise<TSuccessResponse<TColumn[]>> {
    return await axiosClient.patch('/kanban/update_order_columns', {columns: columns}, {
      params: {
        board_id: boardId
      }
    })
  }

  async deleteColumn(boardId: number, columnId: number): Promise<TSuccessResponse<TColumn>> {
    return await axiosClient.delete('/kanban/delete_column', {params: {board_id: boardId, column_id: columnId}})
  }


  async getCards(boardId?: number, columnId?: number): Promise<TSuccessResponse<TCard[]>> {
    return await axiosClient.get('/kanban/get_cards', {
      params: {
        board_id: boardId,
        column_id: columnId
      }
    })
  }

  async getCard(cardId?: number, columnId?: number): Promise<TSuccessResponse<TCard>> {
    return await axiosClient.get('/kanban/get_card_by_id', {
      params: {
        card_id: cardId,
        column_id: columnId
      }
    })
  }

  async createCard(columnId: number, data: {title: string, description: string}): Promise<TSuccessResponse<TCard>> {
    return await axiosClient.post('/kanban/create_card', {title: data.title, description: data.description}, {
      params: {
        column_id: columnId
      }
    })
  }

  async updateCard(columnId: number, cardId: number, data: {title: string, description: string, order: number}): Promise<TSuccessResponse<TCard>> {
    return await axiosClient.patch('/kanban/update_card', {title: data.title, description: data.description, order: data.order}, {
      params: {
        column_id: columnId,
        card_id: cardId
      }
    })
  }

  async reordersCards({columnId, newColumnId, cardId, newOrder}: {columnId: number, newColumnId: number, cardId: number, newOrder: number}): Promise<TSuccessResponse<null>> {
    return await axiosClient.patch('/kanban/reorder_cards', {}, {
      params: {
        column_id: columnId, 
        new_column_id: newColumnId, 
        card_id: cardId, 
        new_order: newOrder
      }
    })
  }

  async deleteCard(columnId: number, cardId: number): Promise<TSuccessResponse<TCard>> {
    return await axiosClient.delete('/kanban/delete_card', {
      params: {
        column_id: columnId,
        card_id: cardId
      }
    })
  }
}

export const kanbanService = new KanbanService()
