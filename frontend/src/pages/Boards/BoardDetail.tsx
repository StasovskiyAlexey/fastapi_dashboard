import ColumnCard from "@/components/ColumnCard";
import CreateCardModal from "@/components/modals/CreateCardModal";
import CreateColumnModal from "@/components/modals/CreateColumnModal";
import UpdateCardModal from "@/components/modals/UpdateCardModal";
import UpdateColumnModal from "@/components/modals/UpdateColumnModal";
import ScreenLoader from "@/components/ScreenLoader";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/queries/useBoards";
import { useColumnMutations, useColumnsList } from "@/hooks/queries/useColumns";
import useModalStore from "@/store/modal.store";
import { useParams, useRouter } from "@tanstack/react-router";
import { MoveLeft, Plus } from "lucide-react";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { queryClient } from "@/lib/query-client";
import { useState } from "react";

export default function BoardDetail() {
  const boardId = parseInt(useParams({strict: false}).boardId)
  const [activeId, setActiveId] = useState<number>(0)

  const {switcher} = useModalStore()
  const router = useRouter()

  const {data: board} = useBoard(boardId)
  const {data: columns, isLoading} = useColumnsList(boardId)
  const {updateOrdersColumns} = useColumnMutations()
  
  if (isLoading) {
    return <ScreenLoader/>
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active) {
      setActiveId(active.id)
    }

    if (!over) return;

    if (active.id !== over.id && columns) {
      const oldIndex = columns?.findIndex(col => col?.id === active.id);
      const newIndex = columns?.findIndex(col => col?.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return

      const newColumns = arrayMove(columns, oldIndex, newIndex).map(col => ({id: col!.id, order: col!.order}))
      updateOrdersColumns({boardId, columns: newColumns})

      queryClient.setQueryData(['columns-list', boardId], newColumns)
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

        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={columns?.map(el => el?.id as number) || []} strategy={verticalListSortingStrategy}>
            <main className="flex-1 overflow-x-auto p-4 flex gap-6 items-start">
              {columns?.length === 0 && `У дошці ${board?.title} немає активних колонок...`}
              {columns?.length !== 0 && columns?.map((column) => (
                <ColumnCard
                  column={column}
                  key={column?.id}
                  columnId={column?.id as number}
                  boardId={boardId}
                />
              ))}

              <DragOverlay>
                {activeId && <ColumnCard column={columns?.find(col => col?.id === activeId)} columnId={activeId} boardId={boardId}/>}
              </DragOverlay>
            </main>
          </SortableContext>
        </DndContext>
      </div>
      <CreateColumnModal/>
      <CreateCardModal/>
      <UpdateColumnModal/>
      <UpdateCardModal/>
    </>
  )
}
