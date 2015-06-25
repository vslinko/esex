export default function createStaticTransition({status = 200, title, ...other}) {
  return function transition(queryParams = {}) {
    return () => {
      return {
        status,
        title,
        queryParams,
        ...other
      }
    }
  }
}
