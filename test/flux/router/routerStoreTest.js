import routerStore from '../../../src/flux/router/routerStore' // eslint-disable-line

describe('flux/router/routerStore', () => {
  it('should return a router store',() => {
    const result = routerStore([{type: '1', id: '1'}], {type: 'RESOURCES_UPDATE', resources: [{type: '2', id: '2'}]})
    const expected = [{type: '1', id: '1'}]

    assert.deepEqual(expected, result)
  })
})
