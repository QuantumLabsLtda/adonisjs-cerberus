/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

/* eslint-disable space-before-function-paren */
/* eslint-disable no-unneeded-ternary */
'use strict'

const { Command } = require('@adonisjs/ace')
const Permission = require('../src/Commands/BasePermission')
const Database = use('Database')
const Resource = use('Cerberus/Models/Resource')
const { asyncForEach } = require('../util/Util')

class PermissionCommand extends Command {
  constructor() {
    super()
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
        cerberus:permission
        { -a, --all: Run default permission creation for each Resource in database }
        { --resource-name=@value: Name of resource }
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
    return 'Create new Cerberus Default Permission'
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
  async handle (args, { resourceName, all }) {
    try {
      if (all) {
        // Fetch all Resources in database
        const resources = await Resource.all()
        // Loop in each Resource, creating a permission
        await asyncForEach(resources.rows, async (resource) => {
          // Ask for permission parameters
          await this.askPermissionParameters(true, resource.name)
          await this.createPermission({ resourceName: resource.name })
        })
      } else {
        // Ask for permission parameters
        await this.askPermissionParameters(true, resourceName)
        await this.createPermission({ resourceName: resourceName })
      }

      await Database.close()
    } catch ({ message }) {
      // Close Databse connection
      await Database.close()
      this.error(message)
    }
  }
}

module.exports = PermissionCommand
