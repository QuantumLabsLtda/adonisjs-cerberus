'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Resource extends Model {
  permission () {
    return this.hasOne('Cerberus/Models/Permission')
  }
}

module.exports = Resource
