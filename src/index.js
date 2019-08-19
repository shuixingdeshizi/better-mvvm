import { observe } from './observe/index'
import { render } from './vnode/index'

function MVVM (options = {}) {
  const vm = this
  this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

  var data = this._data = options.data || {}
  observe(data)

  render(options.template, vm)
}

export default MVVM