
; (function () {
  const event = {
    clientList: {},
    listen(key, fn) {
      if (!this.clientList[key]) {
        this.clientList[key] = []
      }
      this.clientList[key].push(fn)
    },
    remove(key, fn) {
      if (!this.clientList[key]) {
        return false
      }
      const index = this.clientList[key].findIndex(item => item === fn)
      if (index === -1) {
        return false
      }
      this.clientList[key].splice(index, 1)
    },
    notice(key, ...args) {
      if (!this.clientList[key]) {
        return false
      }
      this.clientList[key].forEach(fn => fn(...args))
    }
  }
  window.event = event
})()