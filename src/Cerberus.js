/* eslint-disable no-unused-vars */
'use strict'
const Config = use('Config')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')
const RESOURCE_ID = ((usingSnakeCaseMappers) ? 'resourceId' : 'resource_id')
const { asyncForEach } = require('../util/Util')

class Cerberus {
  static getPermissionsFromArray (permissionsArray) {
    // Split the properties
    let permissions = permissionsArray.map((val) => val.trim().split('.'))

    // Reduce array into an object
    permissions = permissions.reduce((previous, current, index) => {
      const resource = current[0]
      const permission = current[1]
      const resourceNames = previous.resourceNames
      let resources = previous.resources

      resources = resources.push({ slug: resource, permission: permission })

      if (resourceNames.includes(resource) === false) resourceNames.push(resource)

      return previous
    }, { resources: [], resourceNames: [] })

    return permissions
  }

  static async checkPermissions (neededPermissions, userPermissions, resources) {
    let allowed = true

    // Maps the needed permission resources, adding the resource id for comparision
    neededPermissions.resources = neededPermissions.resources.map((val) => {
      return {
        id: (resources.rows.filter((resource) => val.slug === resource.slug))[0].id,
        ...val
      }
    })

    // Check if user has permissions
    await asyncForEach(neededPermissions.resources, async (resource) => {
      const permission = userPermissions.rows.filter((permission) => permission[RESOURCE_ID] === resource.id)[0]

      // Turn allowed false if has no permission
      if (!permission[resource.permission]) allowed = false
    })

    return allowed
  }
}

module.exports = Cerberus
