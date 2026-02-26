import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import useModalStore from "@/store/modal.store"

export default function ConfirmModal() {
  const {modals, switcher} = useModalStore()

  const action = modals.isOpenConfirmModal.data?.action
  const label = modals.isOpenConfirmModal?.data?.confirmLabel

  const handleConfirm = () => {
    if (action) {
      action()
    }
    switcher('isOpenConfirmModal', false)
  }

  return (
    <AlertDialog open={modals.isOpenConfirmModal.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ви впевнені у ваших діях?</AlertDialogTitle>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => switcher('isOpenConfirmModal', false)} asChild>
             <Button variant="outline">Відмінити</Button>
          </AlertDialogCancel>
          
          <AlertDialogAction onClick={() => handleConfirm()} asChild>
             <Button variant="default">{label ?? ''}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
