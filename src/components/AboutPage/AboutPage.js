import createObservableComponent from 'react-observable'
import Link from '../Link'

function AboutPage({dispatcher}) {
  return (
    <div>
      <h1>About Page</h1>
      <div>
        <Link dispatcher={dispatcher} href="/">Home</Link>
      </div>
    </div>
  )
}

export default createObservableComponent(AboutPage)
