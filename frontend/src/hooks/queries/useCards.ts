import { queryClient } from "@/lib/query-client"
import { kanbanService } from "@/services/kanban.service"
import { useMutation } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner"

export const useCardMutations = () => {
  const boardId = parseInt(useParams({strict: false}).boardId)

  const createMutation = useMutation({
    mutationFn: ({columnId, data }: {boardId: number, columnId: number, data: { title: string, description: string} }) => 
      kanbanService.createCard(columnId, data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['board-item', boardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ columnId, cardId, data }: { columnId: number, cardId: number, data: { title: string, description: string, order: number } }) => 
      kanbanService.updateCard(columnId, cardId, data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['board-item', boardId] });
      queryClient.invalidateQueries({ queryKey: ['board-item', boardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ({columnId, cardId }: { columnId: number, cardId: number }) => 
      kanbanService.deleteCard(columnId, cardId),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['board-item', boardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  });

  const updateOrdersMutation = useMutation({
    mutationFn: ({ columnId, newColumnId, cardId, newOrder}: {columnId: number, newColumnId: number, cardId: number, newOrder: number}) => {
      return kanbanService.reordersCards({columnId, newColumnId, cardId, newOrder})
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({queryKey: ['board-item', boardId]})
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    },
  })

  return {
    createCard: createMutation.mutate,
    updateCard: updateMutation.mutate,
    deleteCard: deleteMutation.mutate,
    reordersCards: updateOrdersMutation.mutate,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || updateOrdersMutation.isPending
  };
};