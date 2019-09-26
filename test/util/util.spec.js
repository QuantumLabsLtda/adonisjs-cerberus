const test = require('japa')
const Util = require('../../util/Util.js')

test('Camelize a string', (assert) => {
  assert.equal(Util.camelize('Cerberus'), 'cerberus')
})
