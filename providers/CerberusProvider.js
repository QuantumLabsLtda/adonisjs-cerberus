'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class AclProvider extends ServiceProvider {
  register () {
    this.app.bind('Cerberus/Models/Resource', () => {
      const Resource = require('../src/Models/Resource')
      Resource._bootIfNotBooted()
      return Resource
    })

    this.app.bind('Cerberus/Models/Role', () => {
      const Role = require('../src/Models/Role')
      Role._bootIfNotBooted()
      return Role
    })

    this.app.bind('Cerberus/Models/Permission', () => {
      const Permission = require('../src/Models/Permission')
      Permission._bootIfNotBooted()
      return Permission
    })
  }

  boot () { }
}

module.exports = AclProvider
