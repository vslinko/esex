export async function up(db) {
  const cls = await db.class.create('User', 'V')

  await cls.property.create({
    name: 'email',
    type: 'string',
    mandatory: true,
    notNull: true
  })

  await cls.property.create({
    name: 'password',
    type: 'string',
    mandatory: true,
    notNull: true
  })

  await db.index.create({
    name: 'User.email',
    type: 'unique'
  })
}

export async function down(db) {
  await db.exec('DROP INDEX User.email')
  await db.exec('TRUNCATE CLASS User')
  await db.exec('DROP CLASS User')
}
