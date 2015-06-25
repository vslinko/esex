export default {
  type: 'Order',
  attributes: {
  },
  relationships: {
    positions: {
      class: 'OrderPosition'
    }
  }
}
