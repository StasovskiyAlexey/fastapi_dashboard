import { axiosClient } from "@/api/client";
import type { TSuccessResponse } from "@/types/response";
import type { TUpdateUserEmail, TUpdateUserPassword, TUser } from "@/types/user";

class DashboardService {
  async updateUser(data: TUpdateUserEmail): Promise<TSuccessResponse<TUser>> {
    return await axiosClient.patch('/users/update_user/', { login: data.login, email: data.email })
  }

  async updateUserPassword({password, newPassword}: TUpdateUserPassword): Promise<TSuccessResponse<TUser>> {
    return await axiosClient.patch('/users/update_user_password', { password, new_password: newPassword })
  }

  async deleteUserAccount(): Promise<TSuccessResponse<TUser>> {
    return await axiosClient.delete('/users/delete_user')
  }
}

export const dashboardService = new DashboardService()