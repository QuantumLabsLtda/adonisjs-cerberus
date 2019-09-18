/* eslint-disable no-unneeded-ternary */
'use strict'

const { Command } = require('@adonisjs/ace')
const Resource = use('Cerberus/Models/Resource')
const Role = use('Cerberus/Models/Role')
const Permission = use('Cerberus/Models/Permission')
const Database = use('Database')
const Helpers = use('Helpers')
const fs = Helpers.promisify(require('fs'))
const path = require('path')
const { asyncForEach, camelize } = require('../util/Util')

class ResourceCommand extends Command {
  constructor() {
    super()
    this.roleSlug = null
    this.permissionsArray = null
  }

  /**
   * The command signature getter to define the
   * command name, arguments and options.
   *
   * @attribute signature
   * @static
   *
   * @return {String}
   */
  static get signature () {
    return `
        cerberus:resource
        { name?: Name of the resource }
        { slug?: Short name for resource }
        { -p, --permission: Generate permissions }
        { -a, --always-ask: Ask which permissions give in each Resource once (false by default)}
        { --from-models: Generate a resource for each app Model }
        { --from-controllers: Generate a resource for each app Controller }
    `
  }

  /**
   * The command description getter.
   *
   * @attribute description
   * @static
   *
   * @return {String}
   */
  static get description () {
    return 'Create new Cerberus Resource'
  }

  /**
   * Creates the resource
   *
   * @method createResource
   *
   * @param  {String} name
   * @param  {String} slug
   *
   * @return {void}
   */
  async createResource (name, slug) {
    // If there's no slug, uses the resource name instead
    if (!slug) slug = name

    await Database.transaction(async (trx) => {
      // Create the resource
      await Resource.create({ name, slug: camelize(slug) }, trx)
    })

    this.success(`${this.icon('success')} resource ${name} created.`)

    // Close Databse connection
    Database.close()

    return true
  }

  /**
 * Ask permission parameters
 *
 * @method askPermissionParameters
 *
 * @param  {Function} alwaysAsk
 *
 * @return {void}
 */
  async askPermissionParameters (alwaysAsk, resourceName) {
    // Asks for role slug
    if (!this.roleSlug) {
      this.roleSlug = await this
        .ask('Which role should I bind to this permission? (Use slug name)')
    }

    // Check if needs to always ask the permissions
    if (alwaysAsk || !this.permissionsArray) {
      let question = null

      if (alwaysAsk) {
        question = `What this role can do with ${resourceName} resource? (a = select all, space = mark option)`
      } else {
        question = 'What this role can do with the resources? (a = select all, space = mark option)'
      }

      this.permissionsArray = await this
        .multiple(question, [
          {
            name: 'Create',
            value: 'create'
          },
          {
            name: 'Read',
            value: 'read'
          },
          {
            name: 'Update',
            value: 'update'
          },
          {
            name: 'Delete',
            value: 'delete'
          }
        ])
    }

    if (!alwaysAsk) this.warn('This will apply the same permissions to all resources. You can change it later 🤠')
  }

  /**
   * Creates a permission
   *
   * @method createPermission
   *
   * @param  {Object} resourceName
   *
   * @return {void}
   */
  async createPermission ({ resourceName }) {
    // Check if role exists
    const role = await Role.findBy('slug', this.roleSlug)
    if (!role) {
      Database.close()
      return this.error('Role not found')
    }

    // Check if resource exists
    const resource = await Resource.findBy('name', resourceName)
    if (!resource) {
      Database.close()
      return this.error('Resource not found')
    }

    // Function for permission checking
    const hasPermission = (permission) => ((this.permissionsArray.find((el) => el === permission)) ? true : false)

    // Create the permission
    await Database.transaction(async (trx) => {
      await Permission.create({
        role_id: role.id,
        resource_id: resource.id,
        create: hasPermission('create'),
        read: hasPermission('read'),
        update: hasPermission('update'),
        delete: hasPermission('delete')
      }, trx)
    })

    return this.info(`Permissions for ${resourceName} created successfully!`)
  }

  /**
   * The handle method to be executed
   * when running command
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle ({ name, slug }, { fromModels, fromControllers, permission, alwaysAsk }) {
    try {
      if (fromModels) {
        // Read project models folder
        const modelsPath = path.join(Helpers.appRoot(), 'app/Models')
        let models = await fs.readdir(modelsPath)
        models = models.filter((val) => val.split('.')[1] === 'js')

        // Loop in models
        await asyncForEach((models), async (model) => {
          const name = model.split('.')[0]
          const slug = name

          // Ask for permission parameters
          if (permission) await this.askPermissionParameters(alwaysAsk, name)

          // Create resource for each model
          await this.createResource(name, slug)

          // Create permission for each resource from model
          if (permission) await this.createPermission({ resourceName: name })
        })
      } else if (fromControllers) {
        // Read project http controllers folder
        const controllersPath = path.join(Helpers.appRoot(), 'app/Controllers/Http')
        let controllers = await fs.readdir(controllersPath)
        controllers = controllers.filter((val) => val.split('.')[1] === 'js')

        // Loop in controllers
        await asyncForEach((controllers), async (controller) => {
          const name = controller.split('Controller')[0]
          const slug = name

          // Ask for permission parameters
          if (permission) await this.askPermissionParameters(alwaysAsk, name)

          // Create resource for each controller
          await this.createResource(name, slug)

          // Create permission for each resource from controller
          if (permission) await this.createPermission({ resourceName: name })
        })
      } else {
        // Ask for permission parameters
        if (permission) await this.askPermissionParameters(alwaysAsk)
        await this.createResource(name, slug)
        if (permission) await this.createPermission({ resourceName: name })
      }

      await Database.close()
    } catch ({ message }) {
      // Close Databse connection
      Database.close()
      this.error(message)
    }
  }
}

module.exports = ResourceCommand
