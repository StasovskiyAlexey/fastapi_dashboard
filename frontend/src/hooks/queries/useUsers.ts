import { useAuth } from "@/providers/AuthProvider"
import { userService } from "@/services/user.service"
import type { TUpdateUser, TUpdateUserPassword } from "@/types/user"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useUsers = () => {
  const {setUser} = useAuth()
  
  const updateUserPassword = useMutation({
    mutationFn: (data: TUpdateUserPassword) => userService.updatePassword({password: data.password, newPassword: data.newPassword}),
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  const updateUserData = useMutation({
    mutationFn: (data: TUpdateUser) => userService.updateUserData(data),
    onSuccess: (data) => {
      console.log(data)
      toast.success(data.message)
      setUser(data.data)
      return data.data
    },
    onError: (error) => {
      console.log(error)
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  const updateUserAvatar = useMutation({
    mutationFn: (data: {avatarUrl?: File | null}) => userService.updateUserAvatar(data.avatarUrl),
    onSuccess: (data) => {
      toast.success(data.message)
      setUser(data.data)
      return data
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  const deleteUser = useMutation({
    mutationFn: () => userService.deleteAccount(),
    onSuccess: (data) => {
      console.log(data)
      toast.success(data.message)
      setUser(null)
    },
    onError: (error) => {
      console.log(error)
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  return {
    updateUserPassword: updateUserPassword.mutateAsync,
    updateUserAvatar: updateUserAvatar.mutateAsync,
    updateUserData: updateUserData.mutateAsync,
    deleteUser: deleteUser.mutateAsync
  }
}