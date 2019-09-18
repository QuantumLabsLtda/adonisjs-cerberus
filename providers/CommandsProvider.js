'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/cerberus:init', () => require('../commands/init'))
    this.app.bind('Adonis/Commands/cerberus:role', () => require('../commands/Role'))
    this.app.bind('Adonis/Commands/cerberus:resource', () => require('../commands/Resource'))
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/cerberus:init')
    ace.addCommand('Adonis/Commands/cerberus:role')
    ace.addCommand('Adonis/Commands/cerberus:resource')
  }
}

module.exports = CommandsProvider
