export default function applyTransaction(db, {steps, returnKey, returnType}) {
  let query = db

  if (returnType !== 'all' && returnType !== 'one') {
    throw new Error(`Unexpected return type "${returnType}", expected "all" or "one"`)
  }

  for (const step of steps) {
    switch (step.type) {
      case 'createVertex':
        query = query
          .let(step.key, s => {
            s.insert().into(step.class).set(step.attributes)
          })
        break

      case 'updateVertex':
        query = query
          .let(step.key, s => {
            s.update(step.class).set(step.attributes).where({'@rid': step.id})
          })
        break

      case 'removeEdges':
        query = query
          .let(step.key, s => {
            s.delete('EDGE', step.class).where({'out': step.from})
          })
        break

      case 'findOne':
        query = query
          .let(step.key, s => {
            s.select().from(step.class).where({'@rid': step.id})
          })
        break

      case 'createEdge':
        query = query
          .let(step.key, s => {
            s.create('edge', step.class).from(step.from).to(step.to)
          })
        break

      default:
        throw new Error(`Unknown transaction step "${step.type}"`)
    }
  }

  query = query
    .return(returnKey)
    .commit()

  return returnType === 'one'
    ? query.one()
    : query.all()
}
