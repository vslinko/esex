const apiRequestInjector = require('inject!../../../src/flux/token/tokenActions')

describe('flux/token/tokenActions', () => {
  let tokenActions, mockApiRequest;

  beforeEach(() => {
    mockApiRequest = sinon.spy()
    tokenActions = apiRequestInjector({
      '../../utilities/apiRequest': mockApiRequest
    })
  })

  it('should return a token object', () => {
    assert.deepEqual({type:'TOKEN', token: 'token'}, tokenActions.setToken('token'))
  })

  it('should invoke login url', () => {
    const res = tokenActions.authorize('test', 'test')()
    assert.equal(mockApiRequest.getCall(0).args[0], '/xhr/login?include=user')
  })

  it('should invoke logout url', () => {
    const res = tokenActions.deauthorize()(()=>{}, ()=>{ return {token: 'token'} })
    assert.equal(mockApiRequest.getCall(0).args[0], '/xhr/logout')
  })
})
