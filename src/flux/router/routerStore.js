import createStore from '../../utilities/createStore'

import {
  ROUTER_PAGE_CHANGE
} from './routerConstants'

const initialState = {
  componentKey: undefined,
  props: undefined
}

function page(state, {componentKey, props}) {
  return {componentKey, props}
}

export default createStore(initialState, {
  [ROUTER_PAGE_CHANGE]: page
})
