import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"

interface ConfirmModalProps {
  isOpen: boolean            // переименовал для ясности
  onClose: () => void        // функция закрытия
  onConfirm: () => void      // функция действия
  title?: string
  description?: string       // добавил для гибкости
  confirmLabel: string       // текст кнопки действия
  cancelLabel?: string       // текст кнопки отмены
}

export default function ConfrimModal({
  onConfirm,
  onClose,
  isOpen,
  title = 'Ви впевнені у ваших діях?',
  description,
  confirmLabel,
  cancelLabel = 'Відмінити'
}: ConfirmModalProps) {
  return (
    // onOpenChange позволит закрывать модалку по Esc или клику в сторону
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          {/* Отмена — обычно нейтральная кнопка */}
          <AlertDialogCancel onClick={onClose} asChild>
             <Button variant="outline">{cancelLabel}</Button>
          </AlertDialogCancel>
          
          {/* Действие — если оно удаляет, лучше передать variant='destructive' */}
          <AlertDialogAction onClick={onConfirm} asChild>
             <Button variant="default">{confirmLabel}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
