'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {
  permissions () {
    return this.hasMany('Cerberus/Models/Permission')
  }
}

module.exports = Role
