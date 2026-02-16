import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"
import useDashboardStore from '@/store/dashboard.store'
import { useAuth } from '@/providers/AuthProvider'

export default function UpdateUserAvatarModal({isOpen, close}: {isOpen: boolean, close: () => void}) {
  const [file, setFile] = useState<File | null | undefined>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const dashboardStore = useDashboardStore()
  const {setUser} = useAuth()

  const updateUser = async () => {
    const res = await dashboardStore.updateUserAvatar(file)
    setUser(res)
    close()
  }

  // Функция обработки выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Создаем временную ссылку для превью
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  return (
    <Dialog onOpenChange={close} open={isOpen}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Обновить аватар</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4 gap-4">
          {/* Круг превью */}
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input 
              id="picture" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="submit" 
            onClick={updateUser}
            disabled={file === null} 
          >
            {dashboardStore.loading ? "Загрузка..." : "Сохранить изменения"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}