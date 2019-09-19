/* eslint-disable space-before-function-paren */
const { LogicalException } = require('@adonisjs/generic-exceptions')

class ResourceNotFoundException extends LogicalException {
  constructor(resource) {
    const message = `Resource ${resource} not found.`
    const status = 404
    const code = 'CERBERUS_RESOURCE_NOT_FOUND'

    super(message, status, code)
  }
}

module.exports = ResourceNotFoundException
