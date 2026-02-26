import ColumnCard from "@/components/ColumnCard";
import CreateCardModal from "@/components/modals/CreateCardModal";
import CreateColumnModal from "@/components/modals/CreateColumnModal";
import UpdateCardModal from "@/components/modals/UpdateCardModal";
import UpdateColumnModal from "@/components/modals/UpdateColumnModal";
import ScreenLoader from "@/components/ScreenLoader";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/queries/useBoards";
import { useColumnsList } from "@/hooks/queries/useColumns";
import useModalStore from "@/store/modal.store";
import { useParams, useRouter } from "@tanstack/react-router";
import { MoveLeft, Plus } from "lucide-react";

export default function BoardDetail() {
  const boardId = parseInt(useParams({strict: false}).boardId)

  const {switcher} = useModalStore()
  const router = useRouter()

  const {data: board} = useBoard(boardId)
  const {data: columns, isLoading} = useColumnsList(boardId)
  console.log(columns)
  if (isLoading) {
    return <ScreenLoader/>
  }

  return (
    <>
      <div className="overflow-hidden h-full flex flex-col">
        <header className="px-6 rounded-2xl py-4 bg-white border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">{board?.title}</h1>
          <div className="flex gap-4">
            <Button onClick={() => switcher('isOpenCreateColumn', true, {boardId})} className="bg-indigo-700 hover:bg-indigo-500">
              <Plus size={18} />
              <span>Додати колонку</span>
            </Button>
            <Button className="bg-indigo-700 hover:bg-indigo-500" variant='outline' onClick={() => router.history.back()}><MoveLeft color="#fff" /></Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-4 flex gap-6 items-start">
          {!columns?.length && `У дошці ${board?.title} немає активних колонок...`}
          {columns?.length !== 0 && columns?.sort((a, b) => a!.order - b!.order).map((column) => (
            <ColumnCard column={column} key={column?.id} columnId={column?.id as number} boardId={boardId}  />
          ))}
        </main>
      </div>
      <CreateColumnModal/>
      <CreateCardModal/>
      <UpdateColumnModal/>
      <UpdateCardModal/>
    </>
  )
}
