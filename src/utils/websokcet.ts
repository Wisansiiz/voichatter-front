import { websocketStore } from '~/stores/websokcet'

const url = 'ws://127.0.0.1:9000/ws' // 请求的后端地址

interface socket {
  websocket: any
  init: () => any
  send: (e: any) => void
}

// eslint-disable-next-line ts/no-redeclare
const socket: socket = {
  websocket: null,
  init: () => {
    socket.websocket = new WebSocket(url)
    socket.websocket.onmessage = (e: any) => {
      const data = JSON.parse(e.data)
      if (data.type === 3) {
        window.location.href = `/call?from=${data.from}&type=2`
      }
      else {
        const web = websocketStore()
        web.msg = e.data
      }
    }
    socket.websocket.onclose = (e: any) => {
      console.log(e)
    }
  },

  send: (e) => {
    if (socket.websocket.readyState === 0) {
      setTimeout(() => {
        socket.websocket.send(JSON.stringify(e))
      }, 1000)
    }
    else {
      socket.websocket.send(JSON.stringify(e))
    }
  },
}

export { socket }
