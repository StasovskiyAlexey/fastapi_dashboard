import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { LayoutPanelTop } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useModalStore from '@/store/modal.store'
import { useBoardMutations } from '@/hooks/queries/useBoards'
import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/providers/AuthProvider'

export default function CreateBoardModal() {
  const [board, setBoard] = useState<{title: string}>({
    title: ''
  })
  
  const {modals, switcher} = useModalStore()
  const {user} = useAuth()
  const {createBoard} = useBoardMutations()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createBoard(board.title)
    switcher('isOpenCreateBoard', false)
  }

  useEffect(() => {
    setBoard((state) => ({...state, title: board.title}))
  }, [user])

  return (
    <Dialog open={modals.isOpenCreateBoard.isOpen} onOpenChange={() => switcher('isOpenCreateBoard', false)}>
      <DialogContent className="sm:max-w-105 p-0 overflow-hidden border-none shadow-2xl"> 
        <form onSubmit={handleSubmit} className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <LayoutPanelTop size={22} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Нова дошка
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Створіть простір для вашого нового проекту
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label 
                htmlFor="create-title" 
                className="text-xs uppercase tracking-widest text-gray-500 ml-1"
              >
                Назва дошки
              </Label>
              <Input
                value={board.title}
                onChange={(e) => setBoard((state) => ({...state, title: e.target.value}))}
                id="create-title"
                autoFocus
                placeholder="Назва дошки"
                className="h-12 border-gray-200 rounded-xl focus-visible:ring-1 transition-all text-base px-4"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 flex">
            <Button
              onClick={() => switcher('isOpenCreateBoard', false)}
              type="reset"
              variant="ghost" 
              className="rounded-xl font-semibold hover:bg-gray-100"
            >
              Скасувати
            </Button>
            <Button
              disabled={!board.title.length}
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
              Створити
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
