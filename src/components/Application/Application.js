import createObservableComponent from 'react-observable'
import * as pages from '../pages'

function Application({dispatcher}) {
  return dispatcher.observable
    .map(state => ({
      Component: pages[state.router.componentKey],
      props: state.router.props
    }))
    .map(({Component, props}) => <Component {...props} dispatcher={dispatcher} />)
}

export default createObservableComponent(Application)
