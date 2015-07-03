import resourcesStore from '../../../src/flux/resources/resourcesStore' // eslint-disable-line

describe('flux/resources/resourcesStore', () => {
  it('should return merged resources', () => {
     const result = resourcesStore([{type: '1', id: '1'}], {type: 'RESOURCES_UPDATE', resources: [{type: '2', id: '2'}]})
     const expected = [{type: '1', id: '1'}, {type: '2', id: '2'}]
     assert.deepEqual(expected, result)
  })
})
