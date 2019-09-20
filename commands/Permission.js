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
        { --resource-name=@value: Name of the resource }
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
    return 'Create new Cerberus Permission'
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
  async handle (args, { resourceName }) {
    try {
      // Ask for permission parameters
      await this.askPermissionParameters(true, resourceName)
      await this.createPermission({ resourceName: resourceName })

      await Database.close()
    } catch ({ message }) {
      // Close Databse connection
      await Database.close()
      this.error(message)
    }
  }
}

module.exports = PermissionCommand
