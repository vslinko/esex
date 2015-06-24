export default function bindAction(dispatcher, action) {
  return (...args) => {
    return dispatcher.dispatch(action(...args))
  }
}
