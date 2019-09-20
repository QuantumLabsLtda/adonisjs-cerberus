/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

'use strict'
const Config = use('Config')
const Resource = use('Cerberus/Models/Resource')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')
const RESOURCE_ID = ((usingSnakeCaseMappers) ? 'resourceId' : 'resource_id')
const ROLE_ID = ((usingSnakeCaseMappers) ? 'roleId' : 'role_id')

module.exports = class Permission {
  register (Model) {
    Model.prototype.permissions = function () {
      return this.hasMany('Cerberus/Models/Permission', ROLE_ID, ROLE_ID)
    }

    Model.prototype.getResourcePermissions = async function (slug) {
      const resource = await Resource.findByOrFail('slug', slug)

      const permissions = await this.permissions().where(RESOURCE_ID, resource.id).fetch()

      return permissions
    }
  }
}
