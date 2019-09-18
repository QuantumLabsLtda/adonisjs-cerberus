'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permission extends Model {
  role () {
    return this.belongsTo('Cerberus/Models/Role')
  }

  resource () {
    return this.belongsTo('Cerberus/Models/Resource')
  }
}

module.exports = Permission
