import React from 'react'
import appTemplate from './appTemplate'
import Application from '../../components/Application'

export default async function renderPage(request) {
  const status = 200
  const title = 'Esex'

  const pageContent = React.renderToString(
    <Application />
  )

  return {
    status,
    body: appTemplate(title, pageContent)
  }
}
