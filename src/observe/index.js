import { Dep } from './Dep'

function observe (data) {
  Object.keys(data).forEach(key => {
    defineReactive(key, data[key], data)
  })
}

function defineReactive (key, val, data) {
  var dep = new Dep()
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    set: function reactiveSetter (newVal) {
      if (val !== newVal) {
        console.log(newVal)
        val = newVal
      }
    },
    get: function reactiveGetter () {
      console.log(val)
      return val
    }
  })
}

export {
  observe
}