import ScreenLoader from "@/components/ScreenLoader";
import { useBoards } from "@/hooks/queries/useBoards";
import { useParams } from "@tanstack/react-router";
import { GripVertical, MoreHorizontal, Plus } from "lucide-react";

export default function BoardDetail() {
  const boardId = useParams({strict: false}).boardId
  const {board, isLoadingBoard} = useBoards(Number(boardId))

  if (isLoadingBoard) {
    return <ScreenLoader/>
  }
  
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Шапка дошки */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{board?.title}</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={18} />
          <span>Додати колонку</span>
        </button>
      </header>

      {/* Контейнер для колонок */}
      <main className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
        {board?.columns.map((column) => (
          <div key={column.id} className="w-80 shrink-0 flex flex-col bg-slate-100 rounded-xl max-h-full border border-slate-200 shadow-sm">
            
            {/* Заголовок колонки */}
            <div className="p-4 flex justify-between items-center group">
              <div className="flex items-center gap-2">
                <GripVertical className="text-slate-400 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" size={16} />
                <h2 className="font-semibold text-slate-700">{column.title}</h2>
                <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                  {column.cards.length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Список карток */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
              {column.cards.map((card) => (
                <div 
                  key={card.id} 
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <h3 className="text-sm font-medium text-slate-800 mb-2">{card.title}</h3>
                  {card.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{card.description}</p>
                  )}
                  
                  {/* Футер картки */}
                  <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] text-indigo-600 font-bold">
                        JD
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium italic">
                      {new Date(card.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопка додавання картки */}
            <button className="m-3 flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
              <Plus size={16} />
              <span>Додати картку</span>
            </button>
          </div>
        ))}

        {/* Заглушка для нової колонки */}
        <button className="w-80 shrink-0 h-12 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all">
          <Plus size={20} className="mr-2" />
          <span className="font-medium">Створити нову колонку</span>
        </button>
      </main>
    </div>
  )
}
