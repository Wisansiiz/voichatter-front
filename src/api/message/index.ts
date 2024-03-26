/**
 * Request
 */
export interface Request {
  code: number
  data: Data
  message: string
  [property: string]: any
}

export interface Data {
  messagePages: MessagePages
  [property: string]: any
}

export interface MessagePages {
  messageInfo: MessageInfo[]
  pageTotal: number
  [property: string]: any
}

export interface MessageInfo {
  attachment: string
  avatarUrl: string
  channelId: number
  content: string
  messageId: number
  sendDate: string
  senderName: string
  senderUserId: number
  serverId: number
  [property: string]: any
}
