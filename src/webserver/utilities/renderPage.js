import React from 'react'
import createDispatcher from '../../utilities/createDispatcher'
import appTemplate from './appTemplate'
import {setToken} from '../../flux/token/tokenActions'
import {runTransition} from '../../flux/router/routerActions'
import {mergeResources} from '../../flux/resources/resourcesActions'
import Application from '../../components/Application'

export default async function renderPage(request) {
  const {tokenResource, userResource} = request

  const dispatcher = createDispatcher()

  if (tokenResource && userResource) {
    await dispatcher.dispatch(setToken(tokenResource.attributes.hash))
    await dispatcher.dispatch(mergeResources([tokenResource, userResource]))
  }

  const {title, status} = await dispatcher.dispatch(runTransition(request.originalUrl))

  if (status === 401) {
    return {
      status: 302,
      location: '/'
    }
  }

  const state = dispatcher.getState()

  const pageContent = React.renderToString(
    <Application dispatcher={dispatcher} />
  )

  return {
    headers: {
      'Cache-Control': 'no-cache, private, max-age=86400',
      'Vary': 'Cookie'
    },
    status,
    body: appTemplate(title, pageContent, state)
  }
}
