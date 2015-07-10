import createStaticTransition from '../../../src/flux/transition/createStaticTransition' // eslint-disable-line

describe('flux/transition/createStaticTransition', () => {
  it('should return object of transition', () => {
    const expected = {
      status: 200,
      title: 'test',
      queryParams: {query: 'query'}
    }

    assert.deepEqual(createStaticTransition({title: expected.title})(expected.queryParams)(), expected)
  })
})
