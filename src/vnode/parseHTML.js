import { Dep } from '../observe/Dep'

function parseHTML (html) {
  var startTagOpenReg = /^<([a-zA-Z][a-zA-Z0-9_]+)/
  var startTagCloseReg = /^\s*>/
  var endTagReg = /^<\/([a-zA-Z0-0_]+)>/
  var attrReg = /^\s*(?:([a-zA-Z\-]+)=\"([a-zA-Z]+)\")/
  var defaultTagRe = /\{\{([a-zA-Z0-9]+)\}\}/

  var root, index = 0, currentParent, stack = []

  while (html) {
    var textEnd = html.indexOf('<')
    if (textEnd === 0) {
      if (html.match(startTagOpenReg)) {
        // 匹配开始标签
        console.log('parseStartTag')
        var startTag = parseStartTag()
        stack.push(startTag)

        if (!root) {
          root = startTag
        } else {
          currentParent.childrens.push(startTag)
        }
        currentParent = startTag
      }
      if (html.match(endTagReg)) {
        console.log('parseEndTag')
        parseEndTag()
        stack.pop()
        currentParent = stack[stack.length - 1]
      }
    } else {
      // 匹配文本
      let text = html.substring(0, textEnd)
      var expression = parseText(text)
      if (expression) {
        currentParent.childrens.push({
          text,
          nodeType: 1,
          expression
        })
      } else {
        currentParent.childrens.push({
          text,
          nodeType: 1
        })
      }
      advance(text.length)
    }
  }

  function advance (n) {
    index += n
    html = html.substring(n)
  }

  function parseText (text) {
    var match = text.match(defaultTagRe)
    if (match) {
      return match[1]
    }
  }

  function parseStartTag () {
    var start, end
    if (start = html.match(startTagOpenReg)) {
      var element = {
        tagName: start[1],
        nodeType: 3,
        start: index,
        childrens: [],
        attrs: {}
      }
      advance(start[0].length)

      var attr
      while (attr = html.match(attrReg)) {
        advance(attr[0].length)
        element.attrs[attr[1]] = attr[2]
      }

      processIf(element)

      processFor(element)

      if (end = html.match(startTagCloseReg)) {
        advance(end[0].length)
        element.end = index
      }
    }

    return element
  }

  function parseEndTag () {
    var endTag = html.match(endTagReg)
    advance(endTag[0].length)
  }

  function getAndRemoveAttr (el, name) {
    var val
    if (val = el.attrs[name]) {
      delete el.attrs[name]
    }
    return val
  }

  function processIf (el) {
    var exp = getAndRemoveAttr(el, 'v-if')

    if (exp) {
      el.if = exp
    }
  }

  function processFor (el) {
    var forAliasRe = /\s*\(([a-zA-Z]), ([a-zA-Z])\)\s+(?:in|of)\s+(a-zA-Z0-9)+/
    var exp = getAndRemoveAttr(el, 'v-for')
    if (exp) {
      var inMatch = exp.match(forAliasRe)
      el.for = {
        item: inMatch[0],
        index: inMatch[1],
        list: inMatch[3]
      }
    }
  }

  return root
}

export {
  parseHTML
}