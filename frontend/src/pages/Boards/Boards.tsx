import BoardCard from "@/components/BoardCard";
import CreateBoardModal from "@/components/modals/CreateBoardModal";
import UpdateBoardModal from "@/components/modals/UpdateBoardModal";
import ScreenLoader from "@/components/ScreenLoader";
import { Button } from "@/components/ui/button";
import { useBoardsList } from "@/hooks/queries/useBoards";
import useModalStore from "@/store/modal.store";
import { Plus } from "lucide-react";

export default function Boards() {
  const {data, isLoading} = useBoardsList()
  const {switcher} = useModalStore()

  if (isLoading) {
    return <ScreenLoader/>
  }

  return (
    <>
      <header className="px-6 rounded-2xl py-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Усі дошки</h1>
        <Button className="bg-indigo-700 hover:bg-indigo-500" onClick={() => switcher('isOpenCreateBoard', true)}><Plus size={18} /> Додати дошку</Button>
      </header>
      <div className="flex flex-wrap mt-4 gap-6">
        {!data?.length && `У вас немає активних дошок...`}
        {data && data.map((board) => (
          <BoardCard key={board?.id} board={board}/>
        ))}
      </div>
      <UpdateBoardModal/>
      <CreateBoardModal/>
    </>
  )
}
