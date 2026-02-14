import type { paths } from "./types";

export type TUser = paths['/users/{user_id}']['get']['responses']['200']['content']['application/json']['data']

export type TUpdateUserPassword = {
  password?: string
  newPassword?: string
}

export type TUpdateUserEmail = {
  login?: string
  email?: string
}

export type TUserRegister = Pick<NonNullable<TUser>, 'login' | 'email'> & {
  password: string
}

export type TUserLogin = Pick<NonNullable<TUser>, 'login'> & {
  password: string
}