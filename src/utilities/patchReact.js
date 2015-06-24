import React from 'react'

// TODO: remove after https://github.com/facebook/react/pull/3995

const originalCreateElement = React.createElement

React.createElement = function createElement(element, ...rest) {
  let type = element

  if (typeof element === 'function' && !element.prototype.render) {
    if (!element.ReactComponent) {
      element.ReactComponent = class Component {
        static displayName = element.name

        render() {
          return element(this.props)
        }
      }
    }

    type = element.ReactComponent
  }

  return originalCreateElement(type, ...rest)
}
