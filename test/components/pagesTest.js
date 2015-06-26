import * as pages from '../../src/components/pages'

describe('components/pages', () => {
  it('should contain only pages', () => {
    Object.keys(pages).forEach(key => {
      assert.match(key, /Page$/)
    })
  })
})
