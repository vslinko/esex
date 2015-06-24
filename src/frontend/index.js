import './polyfills'

import Application from '../components/Application'

export function bootstrapApplication(container) {
  React.render(
    <Application />,
    container
  )
}
