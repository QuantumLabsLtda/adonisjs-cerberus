'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DefaultPermissionSchema extends Schema {
  up () {
    this.create('default_permissions', (table) => {
      table.increments()
      table
        .integer('resource_id')
        .unsigned()
        .references('id')
        .inTable('resources')
        .notNullable()
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .notNullable()
      table.boolean('create').notNullable().defaultTo(true)
      table.boolean('read').notNullable().defaultTo(true)
      table.boolean('update').notNullable().defaultTo(true)
      table.boolean('delete').notNullable().defaultTo(true)
      table.timestamps()
    })
  }

  down () {
    this.drop('default_permissions')
  }
}

module.exports = DefaultPermissionSchema
