import ColumnCard from "@/components/ColumnCard";
import ScreenLoader from "@/components/ScreenLoader";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/queries/useBoards";
import { useColumnMutations } from "@/hooks/queries/useColumns";
import useModalStore from "@/store/modal.store";
import { useParams, useRouter } from "@tanstack/react-router";
import { MoveLeft, Plus } from "lucide-react";
import { lazy, Suspense } from "react";

const CreateCardModal = lazy(() => import('@/components/modals/CreateCardModal'))
const CreateColumnModal = lazy(() => import('@/components/modals/CreateColumnModal'))
const UpdateCardModal = lazy(() => import('@/components/modals/UpdateCardModal'))
const UpdateColumnModal = lazy(() => import('@/components/modals/UpdateColumnModal'))

import {DragDropContext, Droppable} from '@hello-pangea/dnd'
import type { TColumn } from "@/types/kanban";
import { useCardMutations } from "@/hooks/queries/useCards";

export default function BoardDetail() {
  const boardId = parseInt(useParams({strict: false}).boardId)
  const router = useRouter()

  const switcher = useModalStore((state) => state.switcher)
  
  const {data: board, isLoading, isFetching} = useBoard(boardId)
  const {reorderColumns} = useColumnMutations()
  const {reordersCards} = useCardMutations()

  if (isLoading) {
    return <ScreenLoader/>
  }

  async function handleDragEnd(result: any) {
    const { destination, source } = result;
    console.log(result)

    if (!destination) return

    if (result.type === 'column') {
      const newColumns = [...board?.columns as TColumn[]]
      const [moved] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, moved)

      reorderColumns({boardId, columns: newColumns})
    }

    if (result.type === 'card') {
      const cardId = Number(result.draggableId.slice(5))
      const firstColumnId = Number(source.droppableId.slice(7))
      const secondColumnId = Number(destination.droppableId.slice(7))
      const newOrder = Number(destination.index + 1)

      reordersCards({columnId: firstColumnId, newColumnId: secondColumnId, cardId, newOrder})
    }
    
  }

  return (
    <>
      <div className="overflow-hidden h-full flex flex-col">
        <header className="px-4 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex rounded-xl justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost" 
              size="icon" 
              onClick={() => router.history.back()}
              className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <MoveLeft size={20} />
            </Button>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {board?.title || "Завантаження..."}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => switcher('isOpenCreateColumn', true, { boardId })} 
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="font-semibold text-sm">Додати колонку</span>
            </Button>
          </div>
        </header>
          <DragDropContext onDragEnd={handleDragEnd}>
            <span className="mt-4">{board?.columns?.length === 0 && `У дошці ${board?.title} немає активних колонок...`}</span>
            <Droppable type="column" direction="horizontal" droppableId="columns">
              {(provided) => (
                <main ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-x-auto py-4 flex gap-6 items-start">
                  {isFetching && <ScreenLoader/>}
                  {board?.columns?.map((column, index) => (
                    <ColumnCard
                      column={column}
                      key={column?.id}
                      columnId={column?.id as number}
                      boardId={boardId}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </main>
              )}
            </Droppable>
          </DragDropContext>
      </div>

      <Suspense fallback={<ScreenLoader/>}>
        <CreateColumnModal/>
        <CreateCardModal/>
        <UpdateColumnModal/>
        <UpdateCardModal/>
      </Suspense>
    </>
  )
}
