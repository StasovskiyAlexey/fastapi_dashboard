import { getImageUrl, parseData } from '@/lib/utils'
import { useAuth } from '@/providers/AuthProvider'
import type { TCard } from '@/types/kanban'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useModalStore from '@/store/modal.store'
import { useCardMutations } from '@/hooks/queries/useCards'
import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'

export default function Card({card, columnId}: {card: TCard, columnId: number}) {
  const {user} = useAuth()
  const {switcher} = useModalStore()
  const {deleteCard} = useCardMutations()
  
  return (
    <div
      onClick={() => switcher('isOpenUpdateCard', true, {card, columnId})}
      className="bg-white relative p-4 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
    >
      <h3 className="text-sm font-medium text-slate-800 mb-2">{card?.title}</h3>
      {card?.description && (
        <p className="text-xs text-slate-500 line-clamp-2">{card?.description}</p>
      )}
      
      <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] text-indigo-600 font-bold">
            <Avatar>
              <AvatarImage src={getImageUrl(user?.avatar_url)} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-medium italic">
          {parseData(card?.created_at)}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          deleteCard({columnId, cardId: card?.id as number});
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  )
}
