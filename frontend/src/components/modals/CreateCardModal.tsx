import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { AlignLeft, Plus, SquareStack } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useEffect, useState, type FormEvent } from 'react'
import useModalStore from '@/store/modal.store'
import { useCardMutations } from '@/hooks/queries/useCards'

export default function CreateCardModal() {
  const [card, setCard] = useState<{title: string, description: string}>({
    title: '',
    description: ''
  })

  const {switcher, modals} = useModalStore()
  const {createCard} = useCardMutations()

  const columnId = modals.isOpenCreateCard.data?.columnId

  function handleCreateCard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    createCard({data: {title: card.title, description: card.description}, columnId})
    switcher('isOpenCreateCard', false)
  }

  useEffect(() => {
    if (!modals.isOpenCreateCard.isOpen) {
      setCard({title: '', description: ''})
    }
  }, [modals.isOpenCreateCard.isOpen])

  return (
    <Dialog onOpenChange={() => switcher('isOpenCreateCard', false)} open={modals.isOpenCreateCard.isOpen}>
      <DialogContent className="sm:max-w-150 p-0 overflow-hidden border-none shadow-2xl"> 
        <form onSubmit={handleCreateCard} className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              {/* Синій/Фіолетовий колір для карток */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <SquareStack size={22} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Нове завдання
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Опишіть завдання, яке потрібно виконати
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Назва картки */}
            <div className="flex flex-col gap-2">
              <Label 
                htmlFor="card-title" 
                className="text-xs uppercase tracking-widest text-gray-500 ml-1 font-semibold"
              >
                Назва завдання
              </Label>
              <Input
                value={card.title}
                onChange={(e) => setCard((state) => ({...state, title: e.target.value}))}
                id="card-title"
                autoFocus
                placeholder="Що потрібно зробити?"
                className="h-12 border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 transition-all text-base px-4"
              />
            </div>

            {/* Опис картки */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 ml-1">
                <AlignLeft size={14} className="text-gray-400" />
                <Label 
                  htmlFor="card-desc" 
                  className="text-xs uppercase tracking-widest text-gray-500 font-semibold"
                >
                  Опис
                </Label>
              </div>
              <Textarea
                value={card.description}
                onChange={(e) => setCard((state) => ({...state, description: e.target.value}))}
                id="card-desc"
                placeholder="Додайте деталі (необов'язково)..."
                className="min-h-25 border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500 transition-all resize-none p-4"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 flex">
            <Button
              onClick={() => switcher('isOpenCreateCard', false)}
              type="reset"
              variant="ghost"
              className="rounded-xl font-semibold hover:bg-gray-100"
            >
              Скасувати
            </Button>
            <Button
              disabled={!card.title.length || !card.description.length}
              type="submit"
              className="rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              <Plus size={18} />
              Створити картку
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
