/* eslint-disable no-unneeded-ternary */
'use strict'

const { Command } = require('@adonisjs/ace')
const Permission = use('Cerberus/Models/Permission')
const Role = use('Cerberus/Models/Role')
const Database = use('Database')

class PermissionCommand extends Command {
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
        { name: Name of the resource }
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
  async handle ({ name }) {
    try {
      // Ask for permission parameters
      await this.askPermissionParameters(true)
      await this.createPermission({ resourceName: name })

      await Database.close()
    } catch ({ message }) {
      // Close Databse connection
      await Database.close()
      this.error(message)
    }
  }
}

module.exports = PermissionCommand
