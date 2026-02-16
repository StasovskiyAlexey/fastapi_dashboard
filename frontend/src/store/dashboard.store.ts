import { userService } from '@/services/user.service'
import type { TUpdateUser, TUpdateUserPassword, TUser } from '@/types/user'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { create } from 'zustand'

type TDasboardStore = {
  loading: boolean,
  updateUserPassword: ({password, newPassword}: TUpdateUserPassword) => Promise<TUser | undefined>
  updateUser: (data: TUpdateUser) => Promise<TUser | undefined>
  updateUserAvatar: (avatarUrl?: File | null) => Promise<TUser>
  deleteUser: () => Promise<TUser>
}

const useDashboardStore = create<TDasboardStore>((set) => ({
  loading: false,
  updateUserPassword: async ({password, newPassword}) => {
    set({loading: true})
    try {
      const res = await userService.updatePassword({password, newPassword})
      toast.success(res.message)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  },

  updateUser: async (data: TUpdateUser) => {
    set({loading: true})
    try {
      const res = await userService.updateUserData(data)
      toast.success(res.message)
      console.log(res)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  },

  updateUserAvatar: async (avatarUrl?: File | null) => {
    set({loading: true})
    try {
      const res = await userService.updateUserAvatar(avatarUrl)
      toast.success(res.message)
      console.log(res)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  },

  deleteUser: async () => {
    set({loading: true})
    try {
      const res = await userService.deleteAccount()
      toast.success(res.message)
      return res.data
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.detail)
      }
    } finally {
      set({loading: false})
    }
  }
}))

export default useDashboardStore