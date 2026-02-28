import { getImageUrl, parseData } from '@/lib/utils'
import type { TCard } from '@/types/kanban'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useModalStore from '@/store/modal.store'
import { useCardMutations } from '@/hooks/queries/useCards'
import { Calendar, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useCheckAuth } from '@/hooks/queries/useAuth'

export default function Card({card, columnId}: {card: TCard, columnId: number}) {
  const {data: user} = useCheckAuth()
  const switcher = useModalStore((state) => state.switcher)
  const {deleteCard} = useCardMutations()

  return (
    <div
      onClick={() => switcher('isOpenUpdateCard', true, { card, columnId })}
      className="bg-white relative p-4 rounded-xl shadow-sm border border-slate-200 
                hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-50/50 
                transition-all duration-200 cursor-pointer group flex flex-col gap-3"
    >
      <Button 
        variant="secondary" 
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          deleteCard({ columnId, cardId: card?.id as number });
        }}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 h-7 w-7 
                  rounded-full bg-white shadow-md border border-slate-100
                  text-slate-400 hover:text-red-600 hover:bg-red-50 
                  transition-all duration-200 z-10"
      >
        <Trash2 size={12} />
      </Button>

      <div className="space-y-1">
        <h3 className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
          {card?.title}
        </h3>
        {card?.description && (
          <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed">
            {card?.description}
          </p>
        )}
      </div>

      <div className="mt-1 pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border-2 border-white ring-1 ring-slate-100">
              <AvatarImage src={getImageUrl(user?.avatar_url)} />
              <AvatarFallback className="bg-indigo-50 text-[10px] text-indigo-600 font-bold">
                {user?.login?.substring(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">
              {user?.login?.split(' ')[0]}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={10} />
          <span className="text-[10px] font-medium">
            {parseData(card?.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
