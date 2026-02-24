import { queryClient } from "@/lib/query-client"
import { kanbanService } from "@/services/kanban.service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useBoards = (boardId?: number) => {
  const boardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: kanbanService.getBoards
  })

  const boardQuery = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => kanbanService.getBoard(boardId),
    enabled: !!boardId
  })

  const createMutation = useMutation({
    mutationFn: ({data}: {data: {title: string}}) => kanbanService.createBoard({data: {title: data.title}}),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({queryKey: ['boards']})
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({data, boardId}: {data: {title: string}, boardId?: number}) => kanbanService.updateBoard({data: {title: data.title}, boardId: boardId}),
    onSuccess: (data, variables) => {
      toast.success(data.message)
      queryClient.invalidateQueries({queryKey: ['boards']})
      queryClient.invalidateQueries({queryKey: ['board', variables.boardId]})
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => kanbanService.deleteBoard(id),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({queryKey: ['boards']})
      queryClient.invalidateQueries({queryKey: ['board']})
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  })

  return {
    boards: boardsQuery.data?.data,
    isLoadingBoards: boardsQuery.isLoading,

    board: boardQuery.data?.data,
    isLoadingBoard: boardQuery.isLoading,

    createBoard: createMutation.mutate,
    updateBoard: updateMutation.mutate,
    deleteBoard: deleteMutation.mutate,
  };
}