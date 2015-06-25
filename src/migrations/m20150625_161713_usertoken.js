export async function up(db) {
  const cls = await db.class.create('UserToken', 'E')

  await cls.property.create({
    name: 'out',
    type: 'link',
    mandatory: true,
    notNull: true,
    linkedClass: 'User'
  })

  await cls.property.create({
    name: 'in',
    type: 'link',
    mandatory: true,
    notNull: true,
    linkedClass: 'AccessToken'
  })
}

export async function down(db) {
  await db.exec('TRUNCATE CLASS UserToken')
  await db.exec('DROP CLASS UserToken')
}
