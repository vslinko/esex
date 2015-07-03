import {runTransition, navigateTo} from '../../../src/flux/router/routerActions' // eslint-disable-line
import createDispatcher from '../../../src/utilities/createDispatcher'

describe('flux/router/routerActions', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = createDispatcher().dispatch;
  })

  it('should return config for about page', async () => {
    assert.deepEqual(await runTransition('/about')(dispatch),{url: '/about', title: 'About', status: 200})
  })

  it('should return config for 404 page', async () => {
    assert.deepEqual(await runTransition('/test')(dispatch),{url: '/test', title: 'Not Found', status: 404})
  })

  it('should navigateTo /about and change document title', async () => {
    await navigateTo('/about')(dispatch)
    assert.equal('About', document.title)
  })
})
