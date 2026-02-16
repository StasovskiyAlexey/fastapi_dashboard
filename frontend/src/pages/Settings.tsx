// import ConfirmModal from "@/components/modals/ConfrimModal"
import ScreenLoader from "@/components/ScreenLoader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/providers/AuthProvider"
import useDashboardStore from "@/store/dashboard.store"
import { useNavigate } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import user_img from "@/assets/user_profile.png"
import { getImageUrl } from "@/lib/utils"
import UpdateUserAvatarModal from "@/components/modals/UpdateUserAvatarModal"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function Settings() {
  const {user, setUser} = useAuth()
  const dashboardStore = useDashboardStore()
  const navigate = useNavigate()

  const [openUploadModal, setopenUploadModal] = useState<boolean>(false)

  const userDefaultObj: {id?: number, login?: string, email?: string, password?: string, newPassword?: string, avatarUrl?: string | null} = {
    id: user?.id,
    login: user?.login,
    email: user?.email,
    password: '',
    newPassword: '',
    avatarUrl: user?.avatar_url
  }
  
  const [imageFile, setImageFile] = useState<File | null | undefined>(null)
  const [userData, setUserData] = useState<{login?: string, email?: string, password?: string, newPassword?: string, avatarUrl?: string | null}>(userDefaultObj)

  useEffect(() => {
    setUserData(state => ({...state, email: user?.email, login: user?.login, avatarUrl: user?.avatar_url}))
    console.log(user)
  }, [user])
  
  const updateUser = async () => {
    if (!userData.login && !userData.email && !userData.avatarUrl) return
    const res = await dashboardStore.updateUser({
      login: userData?.login, 
      email: userData.email, 
      avatarUrl: imageFile
    })
    console.log(userData)
    // setUserData({login: res?.login, email: res?.email})
    // setUser((state) => ({...state, id: res!.id, login: res?.login as string, email: res?.email as string, avatar_url: res?.avatar_url as string}))
    console.log(res)
  }
  
  const updatePassword = async () => {
    const res = await dashboardStore.updateUserPassword({password: userData.password, newPassword: userData.newPassword})
    setUserData(userDefaultObj)
    return res
  }

  const deleteUser = async () => {
    const res = await dashboardStore.deleteUser()
    setUserData(userDefaultObj)
    navigate({
      to: '/auth'
    })
    return res
  }

  if (dashboardStore.loading) {
    return <ScreenLoader/>
  }

  return (
    <div className="flex-1 h-full w-full mx-auto">
      {/* Заголовок страницы */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Налаштування аккаунта</h2>
        <p className="text-muted-foreground">
          Керуйте своїми особистими даними та безпекою профілю.
        </p>
      </div>

      <Separator className="mt-6" />

      <div className="py-10">
        {/* Секция профиля */}
        <div className="space-y-6">
          <div className="relative w-max">
            <div className="absolute -top-2 -right-2 z-10">
              <Button size='icon' onClick={() => setopenUploadModal(true)} className="rounded-full flex justify-center items-center"><Plus className="text-white" /></Button>
            </div>
            <Avatar className="z-0" size="lg">
              <AvatarImage src={!user?.avatar_url ? user_img : getImageUrl(user?.avatar_url)} />
              <AvatarFallback>ERROR</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="text-lg font-medium">Публичні дані</h3>
            <p className="text-sm text-muted-foreground">Ці дані будуть видимі іншим користувачам.</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="login">Логин</Label>
              <Input value={userData.login || ''} onChange={(e) => setUserData((state) => ({...state, login: e.target.value}))} id="login" placeholder="Ваш логін"/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input value={userData.email || ''} onChange={(e) => setUserData((state) => ({...state, email: e.target.value}))} id="email" type="email" placeholder="Ваш email" />
            </div>
            <Button onClick={updateUser} disabled={!userData.login?.length || !userData.email?.length} variant="outline" className="w-fit">Оновити профіль</Button>
          </div>
        </div>
        
        <Separator className="my-6" />

        {/* Секция безопасности */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Пароль</h3>
            <p className="text-sm text-muted-foreground">Ваш пароль для входу в акаунт.</p>
          </div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Поточний пароль</Label>
              <Input value={userData.password || ''} onChange={(e) => setUserData((prevState) => ({...prevState, password: e.target.value}))} placeholder="Введіть поточний пароль" id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Новий пароль</Label>
              <Input value={userData.newPassword || ''} onChange={(e) => setUserData((prevState) => ({...prevState, newPassword: e.target.value}))} placeholder="Введіть новий пароль" id="new-password" type="password" />
            </div>
            <Button onClick={updatePassword} disabled={!userData.password || !userData.newPassword} variant="outline" className="w-fit">Змінити пароль</Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Видалити акаунт</h3>
            <p className="text-sm text-muted-foreground">Якщо ви видалите цей акаунт, доступу до нього більше не буде.</p>
          </div>
          <div className="space-y-4">
            {/* <Button onClick={() => setOpen({modal: 'deleteUser', trigger: true})} variant="destructive" className="w-fit">Видалити акаунт</Button> */}
            <Button onClick={deleteUser} variant="destructive" className="w-fit">Видалити акаунт</Button>
          </div>
        </div>
      </div>
      {/* <ConfirmModal onClose={() => setOpen({modal: 'deleteUser', trigger: false})} onConfirm={deleteUser} isOpen={open.trigger} confirmLabel="Видалити гравця"/> */}
      <UpdateUserAvatarModal close={() => setopenUploadModal(false)} isOpen={openUploadModal}/>
    </div>
  )
}

export default Settings