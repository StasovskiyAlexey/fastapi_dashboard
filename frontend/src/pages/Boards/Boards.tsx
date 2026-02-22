import ScreenLoader from "@/components/ScreenLoader";
import { parseData } from "@/lib/utils";
import useKanbanStore from "@/store/kanban.store";
import { Link } from "@tanstack/react-router";
import { Calendar, Layers, Layout, MoreVertical } from "lucide-react";
import { useEffect } from "react";

export default function Boards() {
  const {getBoards, loading, boards} = useKanbanStore()

  useEffect(() => {
    getBoards()
  }, [])

  if (loading) {
    return <ScreenLoader/>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {boards && boards.map((board) => (
        <Link
          key={board?.id}
          to={`/boards/${board?.id}`}
          className="group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between min-h-45"
        >
          {/* Декоративний акцент зверху при ховері */}
          <div className="absolute top-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <Layout size={20} />
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical size={18} />
              </button>
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
        </Link>
      ))}
    </div>
  )
}
