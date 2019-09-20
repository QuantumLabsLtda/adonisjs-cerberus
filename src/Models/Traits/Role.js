/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

'use strict'
const Config = use('Config')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')

module.exports = class Role {
  register (Model) {
    Model.prototype.role = function () {
      if (usingSnakeCaseMappers) {
        return this.hasOne('Cerberus/Models/Role', 'roleId', 'id')
      } else {
        return this.hasOne('Cerberus/Models/Role', 'role_id', 'id')
      }
    }
  }
}
