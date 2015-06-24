export async function up(db) {
  const cls = await db.class.create('OrderPosition', 'E')

  await cls.property.create({
    name: 'out',
    type: 'link',
    mandatory: true,
    notNull: true,
    linkedClass: 'Order'
  })

  await cls.property.create({
    name: 'in',
    type: 'link',
    mandatory: true,
    notNull: true,
    linkedClass: 'Item'
  })

  await cls.property.create({
    name: 'amount',
    type: 'integer',
    mandatory: true,
    notNull: true,
    min: 1
  })

  await db.index.create({
    name: 'OrderPosition.out_in',
    class: 'OrderPosition',
    properties: ['out', 'in'],
    type: 'unique'
  })
}

export async function down(db) {
  await db.exec('DROP INDEX OrderPosition.out_in')
  await db.exec('TRUNCATE CLASS OrderPosition')
  await db.exec('DROP CLASS OrderPosition')
}
