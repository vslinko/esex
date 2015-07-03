import {mergeResources} from '../../../src/flux/resources/resourcesActions' // eslint-disable-line

describe('flux/resources/resourcesActions', () => {
  it('should return action', () => {
    const expected = {
      type: 'RESOURCES_UPDATE',
      resources: {test: 'test'}
    }

    assert.deepEqual(expected, mergeResources({test: 'test'}))
  })
})
