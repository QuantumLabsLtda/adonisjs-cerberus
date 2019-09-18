'use strict'

const { Command } = require('@adonisjs/ace')
const Resource = use('Cerberus/Models/Resource')
const Database = use('Database')

class ResourceCommand extends Command {
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
    return 'cerberus:resource { name: Name of the resource } { slug?: Short name for resource }'
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
      // If there's no slug, uses the resource name instead
      if (!slug) slug = name

      await Database.transaction(async (trx) => {
        // Create the resource
        await Resource.create({ name, slug })
      })

      this.success(`${this.icon('success')} resource ${name} created.`)

      // Close Databse connection
      Database.close()
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = ResourceCommand
