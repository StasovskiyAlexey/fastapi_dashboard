import { queryClient } from "@/lib/query-client"
import { kanbanService } from "@/services/kanban.service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useBoardsList = () => {
  return useQuery({
    queryKey: ['boards-list'],
    queryFn: kanbanService.getBoards,
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export const useBoard = (boardId?: number) => {
  return useQuery({
    queryKey: ['board-item', boardId],
    queryFn: () => kanbanService.getBoard(boardId),
    enabled: !!boardId,
    select: (data) => data.data,
  });
};

export const useBoardMutations = () => {
  const createMutation = useMutation({
    mutationFn: (title: string) => 
      kanbanService.createBoard({ data: { title } }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['boards-list'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ boardId, title }: { boardId: number, title: string }) => 
      kanbanService.updateBoard({ data: { title }, boardId }),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['boards-list'] });
      queryClient.invalidateQueries({ queryKey: ['board-item', variables.boardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => kanbanService.deleteBoard(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['boards-list'] });
      // Видаляємо конкретну дошку з кешу, щоб не було залишків
      queryClient.removeQueries({ queryKey: ['board-item'] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  });

  return {
    createBoard: createMutation.mutate,
    updateBoard: updateMutation.mutate,
    deleteBoard: deleteMutation.mutate,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};