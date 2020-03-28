export class Observable {
  constructor() {
    this.subscribers = []
  }

  subscribe(callback) {
    this.subscribers.push(callback)
  }

  notifyObservers(params) {
    for (const callback of this.subscribers) callback(params)
  }
}
