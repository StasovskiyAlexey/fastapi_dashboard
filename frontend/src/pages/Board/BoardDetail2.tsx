import ColumnCard from "@/components/ColumnCard";
import ScreenLoader from "@/components/ScreenLoader";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/queries/useBoards";
import { useColumnMutations, useColumnsList } from "@/hooks/queries/useColumns";
import useModalStore from "@/store/modal.store";
import { useParams, useRouter } from "@tanstack/react-router";
import { MoveLeft, Plus } from "lucide-react";

import { closestCenter, DndContext, DragOverlay, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { queryClient } from "@/lib/query-client";
import { lazy, Suspense, useState } from "react";
import { useCardMutations, useCardsList } from "@/hooks/queries/useCards";

const CreateCardModal = lazy(() => import('@/components/modals/CreateCardModal'))
const CreateColumnModal = lazy(() => import('@/components/modals/CreateColumnModal'))
const UpdateCardModal = lazy(() => import('@/components/modals/UpdateCardModal'))
const UpdateColumnModal = lazy(() => import('@/components/modals/UpdateColumnModal'))

export default function BoardDetail() {
  const boardId = parseInt(useParams({strict: false}).boardId)
  const [activeId, setActiveId] = useState<number | null>(null)
  const router = useRouter()

  const switcher = useModalStore((state) => state.switcher)
  const {reordersCards} = useCardMutations()
  
  const {data: board} = useBoard(boardId)
  const {data: columns, isLoading} = useColumnsList(boardId)
  const {data: cards} = useCardsList(boardId, activeId as number)
  const {updateOrdersColumns} = useColumnMutations()
  console.log(cards, columns)

  if (isLoading) {
    return <ScreenLoader/>
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log(active, over)

    if (active) {
      setActiveId(Number(active.id))
    }

    if (!over) return

    if (active.data.current?.type === 'column') {
      if (active.id !== over?.id && columns) {
        const oldIndex = columns?.findIndex(col => col?.id === active.id);
        const newIndex = columns?.findIndex(col => col?.id === over?.id);

        if (oldIndex === -1 || newIndex === -1) return
        const newColumns = arrayMove(columns, oldIndex, newIndex).map(col => ({id: col!.id, order: col!.order}))

        updateOrdersColumns({boardId, columns: newColumns})

        queryClient.setQueryData(['columns-list', boardId], newColumns)
      }
    }

    if (active.data.current?.type === 'card') {
      if (active.id !== over?.id && cards) {
        const oldIndex = cards?.findIndex(card => card?.id === active.id);
        const newIndex = cards?.findIndex(card => card?.id === over?.id);

        if (oldIndex === -1 || newIndex === -1) return
        const movedCards = arrayMove(cards, oldIndex, newIndex).map(card => ({id: card!.id, order: card!.order}))

        // reordersCards({columnId: active.id, newColumnId: over.id, cardId: active.id, newOrder: 1})
        
        queryClient.setQueryData(['cards-list', active.data.current?.columnId], movedCards)
      }
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

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columns?.map(el => el?.id as number) || []} strategy={horizontalListSortingStrategy}>
            {!columns?.length && `У дошці ${board?.title} немає активних колонок...`}
            <main className="flex-1 overflow-x-auto py-4 flex gap-6 items-start">
              {columns?.map((column) => (
                <ColumnCard
                  column={column}
                  key={column?.id}
                  columnId={column?.id as number}
                  boardId={boardId}
                />
              ))}

              {/* <DragOverlay>
                {activeId && <ColumnCard column={columns?.find(col => col?.id === activeId)} columnId={activeId} boardId={boardId}/>}
              </DragOverlay> */}
            </main>
          </SortableContext>
        </DndContext>
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
