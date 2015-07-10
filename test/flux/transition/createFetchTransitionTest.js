import createFetchTransition from '../../../src/flux/transition/createFetchTransition' // eslint-disable-line

describe('flux/transition/createFetchTransition', () => {
  let MockApiRequest
  beforeEach(() => {
    MockApiRequest = sinon.spy()
  })

  it('should provide success transition', ()=>{
    const expected = {query: 'query'};
    const res = createFetchTransition({title: 'test', apiRequest: MockApiRequest})(expected)(()=>{},()=>{ return {token: 'test'}})
    
    assert.deepEqual(MockApiRequest.getCall(0).args[0], expected)
  })
})
