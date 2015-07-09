import {range} from 'ramda'
import bcrypt from 'bcryptjs'
import config from '../webserver/di/config'

export default async function(db) {
  // TODO: fix password save
  const users = await* range(0, 3)
    .map(i => {
      const email = i + '@example.com'
      const password = bcrypt.hashSync('12345Wq', config.bcrypt.rounds)

      return db.insert().into('User').set({email, password}).one()
    })

  return {
    users
  }
}
