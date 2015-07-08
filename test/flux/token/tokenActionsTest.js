// import {setToken, authorize} from '../../../src/flux/token/tokenActions' // eslint-disable-line

const mockApiRequest = sinon.spy()
const apiRequestInjector = require('inject!../../../src/flux/token/tokenActions')

describe('flux/token/tokenActions', () => {
  let tokenActions;

  beforeEach(() => {
    tokenActions = apiRequestInjector({
      '../../utilities/apiRequest': mockApiRequest
    })
    console.log(tokenActions)
  })

  it('should return a token object', () => {
    assert.deepEqual({type:'TOKEN', token: 'token'}, setToken('token'))
  })

  it('should', () => {
    const res = authorize('test', 'test')()
    assert.equal(mockApiRequest.getCall(0).args[0], '/xhr/login?include=user')
  })
})
