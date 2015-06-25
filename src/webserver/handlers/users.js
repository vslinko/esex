import UserSchema from '../../schemas/User'
import mapResourceToTransaction from '../db/mapResourceToTransaction'
import applyTransaction from '../db/applyTransaction'
import fulfillQuery from '../db/fulfillQuery'
import validateResourceBySchema from '../utilities/validateResourceBySchema'
import getParamsFromRequest from '../utilities/getParamsFromRequest'
import {OP} from '../../utilities/acl'

export async function indexHandler(request) {
  const {db} = request
  const currentUser = request.user

  if (!UserSchema.schemaAccessRule(UserSchema, currentUser, OP.GET)) {
    return {
      status: currentUser ? 403 : 401,
      body: {data: null} // null-reasonable
    }
  }

  const users = (await db
    .select()
    .from(UserSchema.type)
    .all())
    .filter(user => UserSchema.resourceAccessRule(user, currentUser, OP.GET))

  const body = await fulfillQuery(
    db,
    users,
    getParamsFromRequest(request)
  )

  return {
    body
  }
}

export async function getHandler(request) {
  const {db, params: {id}} = request
  const currentUser = request.user

  if (!UserSchema.schemaAccessRule(UserSchema, currentUser, OP.GET)) {
    return {
      status: currentUser ? 403 : 401,
      body: {data: null} // null-reasonable
    }
  }

  const user = await db
    .select()
    .from(UserSchema.type)
    .where({'@rid': id})
    .one()

  if (!UserSchema.resourceAccessRule(user, currentUser, OP.GET)) {
    return {
      status: 403,
      body: {data: null} // null-reasonable
    }
  }

  const body = await fulfillQuery(
    db,
    user,
    getParamsFromRequest(request)
  )

  return {
    status: body.data ? 200 : 404,
    body
  }
}

export async function postHandler(request) {
  const {db, body: {data}} = request
  const currentUser = request.user

  if (!UserSchema.schemaAccessRule(UserSchema, currentUser, OP.POST)) {
    return {
      status: currentUser ? 403 : 401,
      body: {data: null} // null-reasonable
    }
  }

  if (!data) {
    return {
      status: 400,
      body: {errors: [{
        title: 'Request must include a single resource object as primary data'
      }]}
    }
  }

  if (data.id) {
    return {
      status: 400,
      body: {errors: [{
        title: 'Client-generated id doesn\'t supported'
      }]}
    }
  }

  const errors = validateResourceBySchema(data, UserSchema, true)

  if (errors.length > 0) {
    return {
      status: 400,
      body: {errors}
    }
  }

  const normalizedData = UserSchema.normalize
    ? UserSchema.normalize(data)
    : data
  const transaction = mapResourceToTransaction(normalizedData, UserSchema)
  const user = await applyTransaction(db, transaction)

  const body = await fulfillQuery(
    db,
    user,
    getParamsFromRequest(request)
  )

  return {
    status: 201,
    body
  }
}

export async function deleteHandler(request) {
  const {db, params: {id}} = request
  const currentUser = request.user

  if (!UserSchema.schemaAccessRule(UserSchema, currentUser, OP.DELETE)) {
    return {
      status: currentUser ? 403 : 401,
      body: {data: null} // null-reasonable
    }
  }

  const user = await db
    .select()
    .from(UserSchema.type)
    .where({'@rid': id})
    .one()

  if (!user) {
    return {
      status: 404,
      body: {data: null} // null-reasonable
    }
  }

  if (!UserSchema.resourceAccessRule(user, currentUser, OP.DELETE)) {
    return {
      status: 403,
      body: {data: null} // null-reasonable
    }
  }

  await db
    .delete('VERTEX', UserSchema.type)
    .where({'@rid': id})
    .limit(1)
    .scalar()

  return {
    status: 200,
    body: {data: null} // null-reasonable
  }
}

export async function patchHandler(request) {
  const {db, params: {id}, body: {data}} = request
  const currentUser = request.user

  if (!UserSchema.schemaAccessRule(UserSchema, currentUser, OP.PATCH)) {
    return {
      status: currentUser ? 403 : 401,
      body: {data: null} // null-reasonable
    }
  }

  const user = await db
    .select()
    .from(UserSchema.type)
    .where({'@rid': id})
    .one()

  if (!user) {
    return {
      status: 404,
      body: {data: null} // null-reasonable
    }
  }

  if (!UserSchema.resourceAccessRule(user, currentUser, OP.PATCH)) {
    return {
      status: 403,
      body: {data: null} // null-reasonable
    }
  }

  if (!data) {
    return {
      status: 400,
      body: {errors: [{
        title: 'Request must include a single resource object as primary data'
      }]}
    }
  }

  if (data.id !== id) {
    return {
      status: 400,
      body: {errors: [{
        title: 'Resource id can not be changed'
      }]}
    }
  }

  const errors = validateResourceBySchema(data, UserSchema)

  if (errors.length > 0) {
    return {
      status: 400,
      body: {errors}
    }
  }

  const normalizedData = UserSchema.normalize
    ? UserSchema.normalize(data)
    : data
  const transaction = mapResourceToTransaction(normalizedData, UserSchema)
  const updatedUser = await applyTransaction(db, transaction)

  const body = await fulfillQuery(
    db,
    updatedUser,
    getParamsFromRequest(request)
  )

  return {
    status: 200,
    body
  }
}
