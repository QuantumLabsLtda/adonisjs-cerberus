/* eslint-disable space-before-function-paren */
const { LogicalException } = require('@adonisjs/generic-exceptions')

class ResourceNotFoundException extends LogicalException {
  constructor(resources) {
    const message = `Resources ${resources.join(', ')} not found.`
    const status = 404
    const code = 'CERBERUS_RESOURCE_NOT_FOUND'

    super(message, status, code)
  }
}

module.exports = ResourceNotFoundException
