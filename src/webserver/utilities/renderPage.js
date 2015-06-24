import React from 'react'
import createDispatcher from '../../utilities/createDispatcher'
import appTemplate from './appTemplate'
import Application from '../../components/Application'

export default async function renderPage(request) {
  const status = 200
  const title = 'Esex'

  const dispatcher = createDispatcher()
  const state = dispatcher.getState()

  const pageContent = React.renderToString(
    <Application dispatcher={dispatcher} />
  )

  return {
    status,
    body: appTemplate(title, pageContent, state)
  }
}
