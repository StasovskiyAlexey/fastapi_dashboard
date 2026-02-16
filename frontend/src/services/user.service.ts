import { axiosClient } from "@/api/client";
import type { TSuccessResponse } from "@/types/response";
import type { TUpdateUser, TUpdateUserPassword, TUser } from "@/types/user";

class UserService {
  async updateUserData(data: TUpdateUser): Promise<TSuccessResponse<TUser>> {
    const fd = new FormData()

    if (data.login) fd.append('login', data.login)
    if (data.email) fd.append('email', data.email)
    if (data.avatarUrl) fd.append('avatar_url', data.avatarUrl as File)
    
    return await axiosClient.patch('/users/update_user/', fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async updateUserAvatar(avatarUrl?: File | null): Promise<TSuccessResponse<TUser>> {
    const fd = new FormData()

    if (avatarUrl) fd.append('avatar_url', avatarUrl as File)
    
    return await axiosClient.patch('/users/update_user_avatar', fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async updatePassword({password, newPassword}: TUpdateUserPassword): Promise<TSuccessResponse<TUser>> {
    return await axiosClient.patch('/users/update_user_password', { password, new_password: newPassword })
  }

  async deleteAccount(): Promise<TSuccessResponse<TUser>> {
    return await axiosClient.delete('/users/delete_user')
  }
}

export const userService = new UserService()