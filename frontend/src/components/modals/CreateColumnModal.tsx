import { Columns3, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useModalStore from "@/store/modal.store";
import { useColumnMutations } from "@/hooks/queries/useColumns";
import { useState, type FormEvent } from "react";

export default function CreateColumnModal() {
  const [column, setColumn] = useState({
    title: ''
  })

  const {modals, switcher} = useModalStore()
  const {createColumn} = useColumnMutations()
  const boardId = modals.isOpenCreateColumn.data?.boardId

  function handleCreateColumn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createColumn({data: {title: column.title}, boardId })
    switcher('isOpenCreateColumn', false)
  }

  return (
    <Dialog open={modals.isOpenCreateColumn.isOpen} onOpenChange={() => switcher('isOpenCreateColumn', false)}>
      <DialogContent className="sm:max-w-150 p-0 overflow-hidden border-none shadow-2xl"> 
        <form onSubmit={handleCreateColumn} className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3">
              {/* Змінено колір на Emerald для диференціації від дошок */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Columns3 size={22} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Нова колонка
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Додайте новий етап у ваш робочий процес
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label 
                  htmlFor="column-title" 
                  className="text-xs uppercase tracking-widest text-gray-500 ml-1"
                >
                  Назва колонки
                </Label>
                <Input
                  id="column-title"
                  autoFocus
                  onChange={(e) => setColumn((state) => ({...state, title: e.target.value}))}
                  placeholder="Наприклад: В процесі, Готово..."
                  className="h-12 border-gray-200 rounded-xl focus-visible:ring-1 focus-visible:ring-emerald-500 transition-all text-base px-4"
                />
                </div>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 flex">
            <Button
              onClick={() => switcher('isOpenCreateColumn', false)}
              type="reset"
              variant="ghost"
              className="rounded-xl font-semibold hover:bg-gray-100"
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={!column.title.length}
              className="rounded-xl bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              <Plus size={18} />
              Додати
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
