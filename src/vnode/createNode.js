function createElement (tagName) {
  return document.createElement(tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createNode (vnode, vm) {
  console.log(arguments)
  var node
  if (vnode.nodeType === 1) {
    if (vnode.expression) {
      vnode.text = vnode.text.replace(`{{${vnode.expression}}}`, vm._data[vnode.expression])
    }
    node = createTextNode(vnode.text)
  } else {
    node = createElement(vnode.tagName)
    
    var attrs = vnode.attrs
    for (let prop in attrs) {
      node[prop] = attrs[prop]
    }

    var childrens = vnode.childrens
    for (let i = 0, l = childrens.length; i < l; i++) {
      node.appendChild(createNode(childrens[i], vm))
    }
  }
  if (vnode.if) {
    if (!that._data[vnode.if]) {

      node.style.display = 'none'
    } else {
      node.style.display = 'block'
    }
  }
  return node
}

export {
  createNode
}