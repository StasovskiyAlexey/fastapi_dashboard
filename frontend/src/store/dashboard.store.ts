import { dashboardService } from '@/services/dashboard.service'
import type { TUpdateUserEmail, TUpdateUserPassword, TUser } from '@/types/user'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { create } from 'zustand'

type TDasboardStore = {
  loading: boolean,
  updateUserPassword: ({password, newPassword}: TUpdateUserPassword) => Promise<TUser | undefined>
  updateUser: (data: {email?: string, login?: string}) => Promise<TUser | undefined>
  deleteUser: () => Promise<TUser>
}

const useDashboardStore = create<TDasboardStore>((set) => ({
  loading: false,
  updateUserPassword: async ({password, newPassword}) => {
    set({loading: true})
    try {
      const res = await dashboardService.updateUserPassword({password, newPassword})
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

  updateUser: async (data: TUpdateUserEmail) => {
    set({loading: true})
    try {
      const res = await dashboardService.updateUser(data)
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

  deleteUser: async () => {
    set({loading: true})
    try {
      const res = await dashboardService.deleteUserAccount()
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