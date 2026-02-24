import BoardCard from "@/components/BoardCard";
import CreateBoardModal from "@/components/modals/CreateBoardModal";
import UpdateBoardModal from "@/components/modals/UpdateBoardModal";
import ScreenLoader from "@/components/ScreenLoader";
import { Button } from "@/components/ui/button";
import { useBoards } from "@/hooks/queries/useBoards";
import useModalStore from "@/store/modal.store";

export default function Boards() {
  const {boards, isLoadingBoards} = useBoards()
  const {switcher} = useModalStore()

  if (isLoadingBoards) {
    return <ScreenLoader/>
  }

  return (
    <>
      <div className="bg-gray-50 p-4 rounded-xl">
        <Button onClick={() => switcher('isOpenCreateBoard', true)}>Додати дошку</Button>
      </div>
      <div className="flex flex-wrap mt-4 gap-6">
        {boards && boards.map((board) => (
          <BoardCard key={board?.id} board={board}/>
        ))}
      </div>
      <UpdateBoardModal/>
      <CreateBoardModal/>
    </>
  )
}
