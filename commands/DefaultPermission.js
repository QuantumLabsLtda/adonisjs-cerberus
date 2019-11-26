/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

/* eslint-disable space-before-function-paren */
/* eslint-disable no-unneeded-ternary */
'use strict'

const { Command } = require('@adonisjs/ace')
const DefaultPermission = require('../src/Commands/BaseDefaultPermission')
const Database = use('Database')
const Resource = use('Cerberus/Models/Resource')
const { asyncForEach } = require('../util/Util')

class DefaultPermissionCommand extends Command {
  constructor() {
    super()
    // Init base defaultPermission
    const defaultPermission = new DefaultPermission()
    this.askDefaultPermissionParameters = defaultPermission.askDefaultPermissionParameters
    this.createDefaultPermission = defaultPermission.createDefaultPermission
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
        cerberus:defaultPermission
        { -a, --all: Run default default permission creation for each Resource in database }
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
        // Loop in each Resource, creating a defaultPermission
        await asyncForEach(resources.rows, async (resource) => {
          // Ask for defaultPermission parameters
          await this.askDefaultPermissionParameters(true, resource.name)
          await this.createDefaultPermission({ resourceName: resource.name })
        })
      } else {
        // Ask for defaultPermission parameters
        await this.askDefaultPermissionParameters(true, resourceName)
        await this.createDefaultPermission({ resourceName: resourceName })
      }

      await Database.close()
    } catch ({ message }) {
      // Close Databse connection
      await Database.close()
      this.error(message)
    }
  }
}

module.exports = DefaultPermissionCommand
