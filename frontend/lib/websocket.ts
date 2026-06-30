type MessageHandler<T> = (message: T) => void

export function createWebSocketClient<T>(path: string, onMessage: MessageHandler<T>) {
  const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws"
  const socket = new WebSocket(`${wsBaseUrl}${path}`)

  socket.addEventListener("message", (event) => {
    onMessage(JSON.parse(event.data) as T)
  })

  return {
    send(message: unknown) {
      socket.send(JSON.stringify(message))
    },
    close() {
      socket.close()
    },
  }
}
