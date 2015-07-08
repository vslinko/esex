import tokenStore from '../../../src/flux/token/tokenStore' // eslint-disable-line

describe('flux/token/tokenStore', () => {
  it('should work', () => {
    const result = tokenStore([{type: '1', id: '1'}], {type: 'RESOURCES_UPDATE', resources: [{type: '2', id: '2'}]})
    const expected = [{type: '1', id: '1'}]

    assert.deepEqual(expected, result)
  })
})
