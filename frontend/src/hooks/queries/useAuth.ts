import { queryClient } from "@/lib/query-client"
import { authService } from "@/services/auth.service"
import type { TUserLogin, TUserRegister } from "@/types/user"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ['check-user'],
    queryFn: authService.me,
    select: (data) => data?.data
  })
}

export const useAuthMutations = () => {
  const navigate = useNavigate()

  const login = useMutation({
    mutationFn: (data: TUserLogin) => authService.login(data),
    onSuccess: async (data) => {
      toast.success(data.message)
      await queryClient.invalidateQueries({queryKey: ['check-user']})
      navigate({ to: '/', replace: true })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  const register = useMutation({
    mutationFn: (data: TUserRegister) => authService.register(data),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({queryKey: ['check-user']})
      navigate({ to: '/', replace: true})
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({queryKey: ['check-user']})
      navigate({ to: '/auth', replace: true })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail)
      }
    }
  })

  return {
    login: login.mutate,
    logout: logout.mutate,
    register: register.mutate
  }
}