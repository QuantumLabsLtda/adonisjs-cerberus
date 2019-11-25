/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Config = use('Config')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')

class DefaultPermission extends Model {
  role () {
    const ROLE_ID = ((usingSnakeCaseMappers) ? 'roleId' : 'role_id')

    return this.belongsTo('Cerberus/Models/Role', ROLE_ID, 'id')
  }

  resource () {
    const RESOURCE_ID = ((usingSnakeCaseMappers) ? 'resourceId' : 'resource_id')

    return this.belongsTo('Cerberus/Models/Resource', RESOURCE_ID, 'id')
  }
}

module.exports = DefaultPermission
