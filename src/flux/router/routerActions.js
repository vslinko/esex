import routing, {notFound as notFoundRoute, error as errorRoute} from '../../config/routing'
import * as transitions from '../transition/transitionActions'
import matchRoutePattern from 'match-route-pattern'

import {
  ROUTER_PAGE_CHANGE
} from './routerConstants'

function changePage(componentKey, props) {
  return {
    type: ROUTER_PAGE_CHANGE,
    componentKey,
    props
  }
}

function runNotFoundTransition(url) {
  return async dispatch => {
    const transition = transitions[notFoundRoute.transition]
    const componentKey = notFoundRoute.component

    const {title, status, ...props} = await dispatch(transition())

    dispatch(changePage(componentKey, props))

    return {url, title, status}
  }
}

function runErrorTransition(url, originalProps) {
  return async dispatch => {
    const transition = transitions[errorRoute.transition]
    const componentKey = errorRoute.component

    const {title, status, ...props} = await dispatch(transition())

    dispatch(changePage(componentKey, {...originalProps, ...props}))

    return {url, title, status}
  }
}

export function runTransition(url) {
  return async dispatch => {
    const route = routing
      .map(route => {
        return {...route, match: matchRoutePattern(route.route, url)}
      })
      .filter(({match}) => !!match)
      .shift()

    if (!route) {
      return dispatch(runNotFoundTransition(url))
    }

    const transition = transitions[route.transition]
    const componentKey = route.component

    const {title, status, ...props} = await dispatch(transition(route.match || {}))

    if (status === 401) {
      if (global.history) { // TODO: fix this shit
        dispatch(navigateTo('/'))
      }
    } else if (status === 404) {
      return dispatch(runNotFoundTransition(url))
    } else if (status < 200 || status >= 300) {
      return dispatch(runErrorTransition(url, props))
    } else {
      dispatch(changePage(componentKey, props))
    }

    return {url, title, status}
  }
}

export function navigateTo(url) {
  return async dispatch => {
    const {title} = await dispatch(runTransition(url))

    document.title = title
    history.pushState({url, title}, title, url)
  }
}

export function popState(event) {
  return async dispatch => {
    if (!event.state || !event.state.url) {
      window.location.reload()
      return
    }

    const {url, title} = event.state

    document.title = title

    await dispatch(runTransition(url))
  }
}
