const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    const valid = ['toMain']
    if (valid.includes(channel)) ipcRenderer.send(channel, data)
  },
  receive: (channel, fn) => {
    const valid = ['fromMain']
    if (valid.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => fn(...args))
    }
  }
})
