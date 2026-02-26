import { queryClient } from "@/lib/query-client"
import { kanbanService } from "@/services/kanban.service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner"

export const useCardsList = (boardId?: number, columnId?: number) => {
  return useQuery({
    queryKey: ['cards-list', columnId],
    queryFn: () => kanbanService.getCards(boardId, columnId),
    enabled: !!boardId && !!columnId,
    select: (data) => data.data,
  });
};

export const useCard = (columnId?: number, cardId?: number) => {
  return useQuery({
    queryKey: ['card-item', cardId],
    queryFn: () => kanbanService.getCard(cardId, columnId),
    enabled: !!cardId && !!columnId,
    select: (data) => data.data,
  });
};

export const useCardMutations = () => {
  const createMutation = useMutation({
    mutationFn: ({ columnId, data }: { columnId: number, data: { title: string, description: string, order: number } }) => 
      kanbanService.createCard(columnId, data),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['cards-list', variables.columnId] });
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
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['cards-list', variables.columnId] });
      queryClient.invalidateQueries({ queryKey: ['card-item', variables.cardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ({ columnId, cardId }: { columnId: number, cardId: number }) => 
      kanbanService.deleteCard(columnId, cardId),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['cards-list', variables.columnId] });
      queryClient.removeQueries({ queryKey: ['card-item', variables.cardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  });

  return {
    createCard: createMutation.mutate,
    updateCard: updateMutation.mutate,
    deleteCard: deleteMutation.mutate,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};