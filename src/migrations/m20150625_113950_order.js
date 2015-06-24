export async function up(db) {
  const cls = await db.class.create('Order', 'V')

  await cls.property.create({
    name: 'contactEmail',
    type: 'string',
    mandatory: true,
    notNull: true
  })
}

export async function down(db) {
  await db.exec('TRUNCATE CLASS Order')
  await db.exec('DROP CLASS Order')
}
