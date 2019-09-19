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

    this.app.bind('Cerberus/Traits/Role', () => {
      const Role = require('../src/Models/Traits/Role')
      return new Role()
    })

    this.app.bind('Cerberus/Traits/Permission', () => {
      const Permission = require('../src/Models/Traits/Permission')
      return new Permission()
    })

    this.app.bind('Cerberus/Middleware/Guard', () => {
      const Guard = require('../src/Middleware/Guard')
      return new Guard()
    })

    this.app.bind('Cerberus/Exceptions/PermissionException', () => {
      const PermissionException = require('../src/Exceptions/PermissionException')
      return PermissionException
    })

    this.app.bind('Cerberus/Exceptions/ResourceNotFoundException', () => {
      const ResourceNotFoundException = require('../src/Exceptions/ResourceNotFoundException')
      return ResourceNotFoundException
    })
  }

  boot () { }
}

module.exports = AclProvider
