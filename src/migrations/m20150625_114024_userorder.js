export async function up(db) {
  const cls = await db.class.create('UserOrder', 'E')

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
    linkedClass: 'Order'
  })
}

export async function down(db) {
  await db.exec('TRUNCATE CLASS UserOrder')
  await db.exec('DROP CLASS UserOrder')
}
