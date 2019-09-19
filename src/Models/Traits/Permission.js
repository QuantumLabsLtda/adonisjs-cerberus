'use strict'
const Config = use('Config')
const Resource = use('Cerberus/Models/Resource')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')
const RESOURCE_ID = ((usingSnakeCaseMappers) ? 'resourceId' : 'resource_id')

module.exports = class Permission {
  register (Model) {
    Model.prototype.permissions = async function () {
      const role = await this.role().fetch()
      const permissions = await role.permissions()

      return permissions
    }

    Model.prototype.getResourcePermissions = async function (slug) {
      const resource = await Resource.findByOrFail('slug', slug)

      const permissions = await this.permissions().where(RESOURCE_ID, resource.id).fetch()

      return permissions
    }
  }
}
