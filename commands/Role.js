'use strict'

const { Command } = require('@adonisjs/ace')
const Role = use('Cerberus/Models/Role')
const Database = use('Database')

class SetupCommand extends Command {
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
    return 'cerberus:role { name: Name of the role } { slug?: Short name for role }'
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
    return 'Create new Cerberus Role'
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
  async handle ({ name, slug }) {
    try {
      // If there's no slug, uses the role name instead
      if (!slug) slug = name

      await Database.transaction(async (trx) => {
        // Create the role
        await Role.create({ name, slug })
      })

      this.success(`${this.icon('success')} role ${name} created.`)

      // Close Databse connection
      Database.close()
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = SetupCommand
