import './polyfills'

import React from 'react'
import Application from '../components/Application'
import createDispatcher from '../utilities/createDispatcher'
import {popState} from '../flux/router/routerActions'

import 'nprogress/nprogress.css'

function bootstrapDispatcher(initialState) {
  const dispatcher = createDispatcher(initialState)

  const url = document.location.pathname + document.location.search
  const title = document.title

  history.replaceState({url, title}, title, url)

  window.addEventListener('popstate', event => {
    dispatcher.dispatch(popState(event))
  })

  return dispatcher
}

export function bootstrapApplication(container, initialState) {
  const dispatcher = bootstrapDispatcher(initialState)

  React.render(
    <Application dispatcher={dispatcher} />,
    container
  )
}
