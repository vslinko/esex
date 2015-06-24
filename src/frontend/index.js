import './polyfills'

import React from 'react'
import Application from '../components/Application'
import createDispatcher from '../utilities/createDispatcher'

export function bootstrapApplication(container, initialState) {
  const dispatcher = createDispatcher(initialState)

  React.render(
    <Application dispatcher={dispatcher} />,
    container
  )
}
