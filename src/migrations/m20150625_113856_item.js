export async function up(db) {
  const cls = await db.class.create('Item', 'V')

  await cls.property.create({
    name: 'title',
    type: 'string',
    mandatory: true,
    notNull: true
  })

  await cls.property.create({
    name: 'price',
    type: 'decimal',
    mandatory: true,
    notNull: true,
    min: 0
  })
}

export async function down(db) {
  await db.exec('TRUNCATE CLASS Item')
  await db.exec('DROP CLASS Item')
}
