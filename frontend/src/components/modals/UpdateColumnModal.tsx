import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Pencil, Save } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import useModalStore from '@/store/modal.store'
import { useColumnMutations } from '@/hooks/queries/useColumns'
import { useEffect, useState, type FormEvent } from 'react'

export default function UpdateColumnModal() {
  const [title, setTitle] = useState('')
  const {switcher, modals} = useModalStore()

  const column = modals.isOpenUpdateColumn.data?.column
  const boardId = Number(modals.isOpenUpdateColumn.data?.boardId)

  const {updateColumn} = useColumnMutations()
  
  function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateColumn({data: {title: title, order: 1}, columnId: column?.id, boardId})
    switcher('isOpenUpdateColumn', false)
  }

  useEffect(() => {
    setTitle(column?.title)
  }, [column])

  return (
    <Dialog
      open={modals.isOpenUpdateColumn.isOpen} 
      onOpenChange={() => switcher('isOpenUpdateColumn', false)}
    >
      <DialogContent className="sm:max-w-105 p-0 overflow-hidden border-none shadow-2xl"> 
        <form onSubmit={handleUpdate} className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Pencil size={20} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Редагувати колонку
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Змініть назву етапу вашого проекту
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label 
                htmlFor="update-column-title" 
                className="text-xs uppercase tracking-widest text-gray-500 ml-1"
              >
                Назва колонки
              </Label>
              <Input
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
                id="update-column-title"
                autoFocus
                placeholder="Введіть назву..."
                className="h-12 border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-amber-500 transition-all text-base px-4"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 flex">
            <Button
              onClick={() => switcher('isOpenUpdateColumn', false)}
              type="button"
              variant="ghost" 
              className="rounded-xl font-semibold hover:bg-gray-100"
            >
              Скасувати
            </Button>
            <Button
              disabled={!title?.length}
              type="submit"
              className="rounded-xl bg-black px-6 text-white hover:bg-gray-800 shadow-lg active:scale-95 transition-all"
            >
              <Save size={18} />
              Зберегти
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
