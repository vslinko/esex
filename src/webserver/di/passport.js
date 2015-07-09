import passport from 'passport'
import {BasicStrategy} from 'passport-http'
import BearerStrategy from 'passport-http-bearer'
import db from './orientoDb'
import bcrypt from 'bcryptjs'

passport.use(
  new BasicStrategy(async (email, password, callback) => {
    try {
      const user = await db
        .select()
        .from('User')
        .where({email})
        .one()

      if (!user) {
        return callback(undefined, false)
      }

      const validPassword = await new Promise((resolve, reject) => {
        const hash = user.password.replace(/^bcrypt:/, '')

        bcrypt.compare(password, hash, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })

      if (!validPassword) {
        return callback(undefined, false)
      }

      callback(undefined, user)
    } catch (error) {
      callback(error)
    }
  })
)

passport.use(
  new BearerStrategy(async (token, callback) => {
    try {
      const user = await db
        .select('EXPAND(IN("UserToken"))')
        .from('AccessToken')
        .where({hash: token})
        .one()

      if (!user) {
        return callback(undefined, false)
      }

      callback(undefined, user)

    } catch (error) {
      callback(error)
    }
  })
)

export default passport
