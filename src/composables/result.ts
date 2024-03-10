export interface response {
  code: number
  data?: any
  message: string
  [property: string]: any
}
export interface userLoginReq {
  password: string
  username: string
  [property: string]: any
}
export interface createChannelReq {
  channel_name: string
  type: string
  [property: string]: any
}
