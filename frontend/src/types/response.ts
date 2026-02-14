export type TSuccessResponse<T> = {
  status: number
  message: string
  data: T
}

export type TErrorResponse = {
  status: number
  message: string
}