/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

/* eslint-disable space-before-function-paren */
/* eslint-disable no-unneeded-ternary */
'use strict'

const { Command } = require('@adonisjs/ace')
const Resource = use('Cerberus/Models/Resource')
const Permission = require('../src/Commands/BasePermission')
const Database = use('Database')
const Helpers = use('Helpers')
const path = require('path')
const { asyncForEach, camelize } = require('../util/Util')
const recursive = require('recursive-readdir')

class ResourceCommand extends Command {
  constructor() {
    super()
    this.roleSlug = null
    this.permissionsArray = null

    // Init base permission
    const permission = new Permission()
    this.askPermissionParameters = permission.askPermissionParameters
    this.createPermission = permission.createPermission
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
        { name?: Name of resource }
        { slug?: Short name for resource }
        { -p, --permission: Generate permissions }
        { -a, --always-ask: Ask which permissions give for each Resource (false by default)}
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
        let models = await recursive(modelsPath, ['Hooks', 'Traits'])
        models = models.filter((val) => val.split('.')[1] === 'js')

        // Loop in models
        await asyncForEach((models), async (model) => {
          let name = model.split('.')[0].split('/')
          name = name[(name.length - 1)]
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
        let controllers = await recursive(controllersPath)
        controllers = controllers.filter((val) => val.split('.')[1] === 'js')

        // Loop in controllers
        await asyncForEach((controllers), async (controller) => {
          let name = controller.split('Controller')[1].split('/')
          name = name[(name.length - 1)]
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
