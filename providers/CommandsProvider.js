'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/cerberus:init', () => require('../commands/init'))
    this.app.bind('Adonis/Commands/cerberus:role', () => require('../commands/Role'))
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/cerberus:init')
    ace.addCommand('Adonis/Commands/cerberus:role')
  }
}

module.exports = CommandsProvider
