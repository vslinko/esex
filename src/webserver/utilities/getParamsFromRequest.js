import {mapObj} from 'ramda'

export default function getParamsFromRequest(request) {
  const fields = typeof request.query.fields === 'object'
    ? mapObj(fs => fs.split(',').filter(f => f.trim().length > 0), request.query.fields)
    : {}

  const include = request.query.include
    ? request.query.include.split(',')
    : []

  return {fields, include}
}
