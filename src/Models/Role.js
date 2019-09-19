'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Config = use('Config')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')

class Role extends Model {
  permissions () {
    const ROLE_ID = ((usingSnakeCaseMappers) ? 'roleId' : 'role_id')

    return this.hasMany('Cerberus/Models/Permission', 'id', ROLE_ID)
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Role
