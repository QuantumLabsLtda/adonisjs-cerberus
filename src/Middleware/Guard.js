/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const PermissionException = use('Cerberus/Exceptions/PermissionException')
const ResourceNotFoundException = use('Cerberus/Exceptions/ResourceNotFoundException')
const User = use('App/Models/User')
const Resource = use('Cerberus/Models/Resource')
const Config = use('Config')
const usingSnakeCaseMappers = Config.get('database.usingSnakeCaseMappers')
const RESOURCE_ID = ((usingSnakeCaseMappers) ? 'resourceId' : 'resource_id')
const Cerberus = require('../Cerberus')

class Guard {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth, response }, next, properties) {
    // Get permissions from properties array
    const neededPermissions = Cerberus.getPermissionsFromArray(properties)

    const userId = auth.user.id
    const user = await User.findOrFail(userId)

    // List requested resources
    const resources = await Resource.query().whereIn('slug', neededPermissions.resourceNames).fetch()

    // Throw exception if not found
    if (resources.rows.length <= 0) {
      throw new ResourceNotFoundException(neededPermissions.resourceNames)
    }

    // Maps the resources ids
    const resourceIds = resources.rows.map((val) => val.id)

    // Get user permissions
    const userPermissions = await user.permissions().whereIn(RESOURCE_ID, [resourceIds]).fetch()

    // Check if user has permissions
    const allowed = await Cerberus.checkPermissions(neededPermissions, userPermissions, resources)

    if (!allowed) {
      throw new PermissionException()
    }

    // call next to advance the request
    await next()
  }
}

module.exports = Guard
