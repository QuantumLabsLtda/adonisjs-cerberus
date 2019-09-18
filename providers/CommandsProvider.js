'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/cerberus:init', () => require('../commands/init'))
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/cerberus:init')
  }
}

module.exports = CommandsProvider
