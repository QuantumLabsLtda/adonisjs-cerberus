/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

/* eslint-disable space-before-function-paren */
const { LogicalException } = require('@adonisjs/generic-exceptions')

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
