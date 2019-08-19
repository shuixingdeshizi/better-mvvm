import { parseHTML } from './parseHTML'
import { createNode } from './createNode'

function render (template, vm) {
  var vnode = parseHTML(template)

  var html

  html = createNode(vnode, vm)

  vm.$el.appendChild(html)
}

export {
  render
}