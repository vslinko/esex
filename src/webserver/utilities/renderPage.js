import React from 'react'
import createDispatcher from '../../utilities/createDispatcher'
import appTemplate from './appTemplate'
import {runTransition} from '../../flux/router/routerActions'
import Application from '../../components/Application'

export default async function renderPage(request) {
  const dispatcher = createDispatcher()

  const {title, status} = await dispatcher.dispatch(runTransition(request.originalUrl))

  const state = dispatcher.getState()

  const pageContent = React.renderToString(
    <Application dispatcher={dispatcher} />
  )

  return {
    status,
    body: appTemplate(title, pageContent, state)
  }
}
