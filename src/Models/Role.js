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
const ROLE_ID = ((usingSnakeCaseMappers) ? 'roleId' : 'role_id')

class Role extends Model {
  permissions () {
    return this.hasMany('Cerberus/Models/Permission', 'id', ROLE_ID)
  }

  user () {
    return this.belongsTo('App/Models/User', 'id', ROLE_ID)
  }
}

module.exports = Role
