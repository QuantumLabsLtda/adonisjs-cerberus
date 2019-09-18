'use strict'

const { Command } = require('@adonisjs/ace')
const path = require('path')
const Helpers = use('Helpers')

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
    return 'cerberus:init'
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
    return 'Setup migrations for Cerberus'
  }

  /**
   * Generates the migrations
   * using pre-defined template
   *
   * @method createMigration
   *
   * @param  {String} name
   *
   * @return {void}
   */
  async createMigration (name) {
    const templateFile = path.join(__dirname, '../database/migrations', `${name}.js`)
    const fileName = `${new Date().getTime()}_${name}`
    const filePath = Helpers.migrationsPath(`${fileName}.js`)

    const templateContents = await this.readFile(templateFile, 'utf-8')
    await this.generateFile(filePath, templateContents)

    const createdFile = filePath.replace(Helpers.appRoot(), '').replace(path.sep, '')
    console.log(`${this.icon('success')} ${this.chalk.green('create')} ${createdFile}`)

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
  async handle () {
    try {
      await this.createMigration('role_schema')
      await this.createMigration('resource_schema')
      await this.createMigration('permission_schema')
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = SetupCommand
