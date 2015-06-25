export async function up(db) {
  const cls = await db.class.create('AccessToken', 'V')

  await cls.property.create({
    name: 'hash',
    type: 'string',
    mandatory: true,
    notNull: true
  })

  await db.index.create({
    name: 'AccessToken.hash',
    type: 'unique'
  })
}

export async function down(db) {
  await db.exec('DROP INDEX AccessToken.hash')
  await db.exec('TRUNCATE CLASS AccessToken')
  await db.exec('DROP CLASS AccessToken')
}
