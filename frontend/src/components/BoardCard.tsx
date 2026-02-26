import { parseData } from "@/lib/utils";
import type { TBoard } from "@/types/kanban";
import { Link } from "@tanstack/react-router";
import { Calendar, Layers, Layout, MoreVertical, SquarePen, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useBoardMutations } from "@/hooks/queries/useBoards";
import useModalStore from "@/store/modal.store";
import { memo } from "react";

function BoardCard({board}: {board: TBoard}) {
  const { deleteBoard } = useBoardMutations()
  const switcher = useModalStore((state) => state.switcher)
  
  return (
    <>
      <div className="group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-xl min-w-85 transition-all duration-300 border border-gray-100 flex flex-col justify-between min-h-45">
        <div className="absolute z-20 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => deleteBoard(board?.id as number)}><Trash size={15} /> Видалити дошку</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onSelect={() => switcher('isOpenUpdateBoard', true, {board})}><SquarePen size={15} /> Оновити дошку</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link
          to={`/boards/${board?.id}`}
          className="absolute inset-0 z-10"
        />

        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors duration-300">
              <Layout size={20} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 group-hover:text-black mb-2 line-clamp-1">
            {board?.title}
          </h2>
          
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="flex items-center gap-1 text-xs">
              <Layers size={14} />
              <span>{board?.columns?.length || 0} колонок</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
            <Calendar size={12} />
            {parseData(board?.created_at)}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(BoardCard)