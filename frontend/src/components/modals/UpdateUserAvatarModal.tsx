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
import { Label } from '../ui/label'
import useModalStore from '@/store/modal.store'
import { useUsers } from '@/hooks/queries/useUsers'

export default function UpdateUserAvatarModal() {
  const [file, setFile] = useState<File | null | undefined>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {updateUserAvatar} = useUsers()
  const {switcher, modals} = useModalStore()

  const updateAvatar = async () => {
    await updateUserAvatar({avatarUrl: file})
    switcher('isOpenUpdateAvatar', false)
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
    <Dialog onOpenChange={() => switcher('isOpenUpdateAvatar', false)} open={modals.isOpenUpdateAvatar.isOpen}>
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>Обновить аватар</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4 gap-4">
          {/* Круг превью */}
          <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div> 
        </div>

        <div className='w-max'>
          <Label htmlFor='upload-image' className='cursor-pointer bg-blue-600 text-white p-3 rounded-md'>Загрузить изображение</Label>
          <Input
              id="upload-image" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="cursor-pointer hidden"
            />
        </div>

        <DialogFooter>
          <Button 
            type="submit" 
            onClick={() => updateAvatar()}
            disabled={file === null} 
          >
            Зберегти зміни
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}