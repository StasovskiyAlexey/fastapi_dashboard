import { useEffect, useState, type FormEvent } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { AlignLeft, Save, SquarePen } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import useModalStore from '@/store/modal.store'
import { Button } from '../ui/button'
import { useCardMutations } from '@/hooks/queries/useCards'

export default function UpdateCardModal() {
  const [card, setCard] = useState({
    title: '',
    description: ''
  })

  const {switcher, modals} = useModalStore()
  const {updateCard} = useCardMutations()

  const cardData = modals.isOpenUpdateCard.data?.card
  const columnId = modals.isOpenUpdateCard.data?.columnId
  
  function handleUpdateCard (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateCard({columnId, cardId: cardData?.id, data: {title: card.title, description: card.description, order: 1}})
    switcher('isOpenUpdateCard', false)
  }

  useEffect(() => {
    setCard((state) => ({...state, title: cardData?.title, description: cardData?.description}))
  }, [cardData])
   
  return (
    <Dialog
      onOpenChange={() => switcher('isOpenUpdateCard', false)} 
      open={modals.isOpenUpdateCard.isOpen}
    >
      <DialogContent className="sm:max-w-150 p-0 overflow-hidden border-none shadow-2xl">
        <form onSubmit={handleUpdateCard} className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <SquarePen size={22} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Редагувати завдання
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Оновіть деталі вашого завдання
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Назва картки */}
            <div className="flex flex-col gap-2">
              <Label 
                htmlFor="update-card-title" 
                className="text-xs uppercase tracking-widest text-gray-500 ml-1 font-semibold"
              >
                Назва завдання
              </Label>
              <Input
                value={card.title || ''}
                onChange={(e) => setCard((prev) => ({ ...prev, title: e.target.value }))}
                id="update-card-title"
                autoFocus
                placeholder="Що потрібно зробити?"
                className="h-12 border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 transition-all text-base px-4"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 ml-1">
                <AlignLeft size={14} className="text-gray-400" />
                <Label 
                  htmlFor="update-card-desc" 
                  className="text-xs uppercase tracking-widest text-gray-500 font-semibold"
                >
                  Опис
                </Label>
              </div>
              <Textarea
                value={card.description || ''}
                onChange={(e) => setCard((prev) => ({ ...prev, description: e.target.value }))}
                id="update-card-desc"
                placeholder="Додайте деталі..."
                className="min-h-25 max-h-120 overflow-auto border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-violet-500 transition-all resize-none p-4"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 flex">
            <Button
              onClick={() => switcher('isOpenUpdateCard', false)}
              type="button"
              variant="ghost"
              className="rounded-xl font-semibold hover:bg-gray-100"
            >
              Скасувати
            </Button>
            <Button
              disabled={!card.title?.length}
              type="submit"
              className="rounded-xl bg-violet-600 px-6 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 active:scale-95 transition-all"
            >
              <Save size={18} />
              Зберегти зміни
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
