let baseURL = 'http://11.11.74.38:8977/rxswt'
if (process.env.NODE_ENV === 'development') {
  baseURL = '/rxswt'
}
const websocketUrl = 'ws://11.11.74.38:8977/rxswt/websocket/'

export {
  baseURL,
  websocketUrl
}
