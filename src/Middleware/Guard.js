'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
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
    const resourceIds = resources.rows.map((val) => val.id)

    // Get user permissions
    const userPermissions = await user.permissions().whereIn(RESOURCE_ID, [resourceIds]).fetch()

    // Check if user has permissions
    const allowed = await Cerberus.checkPermissions(neededPermissions, userPermissions, resources)

    if (!allowed) {
      return response.status(401).send({ error: 'Acess denied.' })
    }

    // call next to advance the request
    await next()
  }
}

module.exports = Guard
