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
      <header className="px-4 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex rounded-xl justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Усі дошки
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => switcher('isOpenCreateBoard', true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-semibold text-sm">Додати дошку</span>
          </Button>
        </div>
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
