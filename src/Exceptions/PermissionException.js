/* eslint-disable space-before-function-paren */
const { LogicalException } = require('@adonisjs/generic-exceptions')
const Config = use('Config')

class PermissionException extends LogicalException {
  constructor() {
    const customMessage = null
    const message = (customMessage || 'Acess Denied.')
    const status = 403
    const code = 'CERBERUS_ACCESS_DENIED'

    super(message, status, code)
  }
}

module.exports = PermissionException
