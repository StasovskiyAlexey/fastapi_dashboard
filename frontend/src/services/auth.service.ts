import { axiosClient } from "@/api/client";
import type { TSuccessResponse } from "@/types/response";
import type { TUser, TUserLogin, TUserRegister } from "@/types/user";
import { AxiosError } from "axios";

class AuthService {
  async login(data: TUserLogin): Promise<TSuccessResponse<TUser>> {
    return await axiosClient.post('/users/login', {login: data.login, password: data.password})
  }

  async me(): Promise<TSuccessResponse<TUser> | null | undefined> {
    try {
      return await axiosClient.get('/users/me')
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          return null
        }
      }
    }
  }

  async register(data: TUserRegister): Promise<TSuccessResponse<TUser>> {
    return await axiosClient.post(
      '/users/register', {login: data.login, email: data.email, password: data.password}
    )
  }

  async logout(): Promise<TSuccessResponse<any>> {
    return await axiosClient.post('/users/logout', {})
  }
}

export const authService = new AuthService()
export type TAuthService = AuthService;