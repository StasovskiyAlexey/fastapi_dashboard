import { queryClient } from "@/lib/query-client"
import { kanbanService } from "@/services/kanban.service"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner"

export const useColumnsList = (boardId: number) => {
  return useQuery({
    queryKey: ['columns-list', boardId],
    queryFn: () => kanbanService.getColumns(boardId),
    enabled: !!boardId,
    select: (data) => data.data,
  });
};

export const useColumn = (boardId: number, columnId: number) => {
  return useQuery({
    queryKey: ['column-item', columnId],
    queryFn: () => kanbanService.getColumn(boardId, columnId),
    enabled: !!boardId && !!columnId,
    select: (data) => data.data,
  });
};

export const useColumnMutations = () => {
  const createMutation = useMutation({
    mutationFn: ({ data, boardId }: { data: { title: string }, boardId: number }) => 
      kanbanService.createColumn(data.title, boardId),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['columns-list', variables.boardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ data, columnId, boardId }: { data: { title: string, order: number }, columnId: number, boardId: number }) => 
      kanbanService.updateColumn(data.title, data.order, columnId, boardId),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['columns-list', variables.boardId] });
      queryClient.invalidateQueries({ queryKey: ['column-item', variables.columnId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: ({ columnId, boardId }: { columnId: number, boardId: number }) => 
      kanbanService.deleteColumn(boardId, columnId),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['columns-list', variables.boardId] });
      queryClient.removeQueries({ queryKey: ['column-item', variables.columnId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  });

  const updateOrdersMutation = useMutation({
    mutationFn: ({boardId, columns}: {boardId: number, columns: {id: number, order: number}[]}) => 
      kanbanService.update_columns_orders(boardId, columns),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['columns-list', variables.boardId] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.success(error.response?.data.detail)
      }
    }
  })

  return {
    createColumn: createMutation.mutate,
    updateColumn: updateMutation.mutate,
    deleteColumn: deleteMutation.mutate,
    updateOrdersColumns: updateOrdersMutation.mutate,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};

// export const useColumns = ({options, fetch = false}: {options?: {boardId?: number, columnId?: number}, fetch?: boolean}) => {
//   const columnsQuery = useQuery({
//     queryKey: ['columns-list'],
//     queryFn: () => kanbanService.getColumns(options?.boardId),
//     enabled: !!options?.boardId && fetch
//   })

//   const columnQuery = useQuery({
//     queryKey: ['column-item', options?.columnId],
//     queryFn: () => kanbanService.getColumn(options?.boardId, options?.columnId),
//     enabled: !!options?.boardId && !!options?.columnId && fetch
//   })

//   const createMutation = useMutation({
//     mutationFn: ({data, boardId}: {data: {title: string, order: number}, boardId: number}) => kanbanService.createColumn(data.title, boardId, data.order),
//     onSuccess: (data) => {
//       toast.success(data.message)
//       queryClient.invalidateQueries({queryKey: ['columns']})
//     }
//   })

//   const updateMutation = useMutation({
//     mutationFn: ({data, columnId, boardId}: {data: {title: string, order: number}, columnId: number, boardId: number}) => kanbanService.updateColumn(data.title, data.order, columnId,  boardId),
//     onSuccess: (data) => {
//       toast.success(data.message)
//       queryClient.invalidateQueries({queryKey: ['columns']})
//     }
//   })

//   const deleteMutation = useMutation({
//     mutationFn: ({columnId, boardId}: {columnId: number, boardId: number}) => kanbanService.deleteColumn(boardId, columnId),
//     onSuccess: (data) => {
//       toast.success(data.message)
//       queryClient.invalidateQueries({queryKey: ['columns']})
//     }
//   })
  
//   return {
//     columns: columnsQuery.data?.data,
//     isLoadingColumns: columnsQuery.isLoading,

//     column: columnQuery.data?.data,
//     isLoadingColumn: columnQuery.isLoading,
    
//     createColumn: createMutation.mutate,
//     updateColumn: updateMutation.mutate,
//     deleteColumn: deleteMutation.mutate
//   }
// }