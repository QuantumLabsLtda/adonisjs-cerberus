'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .notNullable()
    })
  }

  down () {
    this.alter('users', (table) => {
      table.dropColumn('role_id')
    })
  }
}

module.exports = UserSchema
