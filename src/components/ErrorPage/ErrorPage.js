import createObservableComponent from 'react-observable'

function ErrorPage({errorMessage, errorStack}) {
  return (
    <div>
      <h1>Application Error</h1>
      <h2>{errorMessage}</h2>
      <pre>{errorStack}</pre>
    </div>
  )
}

export default createObservableComponent(ErrorPage)
