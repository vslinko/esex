import createObservableComponent from 'react-observable'
import {navigateTo} from '../../flux/router/routerActions'

function Link(props) {
  const {dispatcher, href} = props

  // TODO: handle edge cases like ctrl+click
  const handleClick = event => {
    event.preventDefault()
    dispatcher.dispatch(navigateTo(href))
  }

  return (
    <a {...props} onClick={handleClick} />
  )
}

export default createObservableComponent(Link)
