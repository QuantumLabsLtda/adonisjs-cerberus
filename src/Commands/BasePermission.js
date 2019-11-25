/**
 * Adonisjs Cerberus
 * Copyright(c) 2019 Quantum Labs Ltda.
 * BSD 3-Clause Licensed
 */

/* eslint-disable no-unneeded-ternary */
const DefaultPermission = use('Cerberus/Models/DefaultPermission')
const Resource = use('Cerberus/Models/Resource')
const Role = use('Cerberus/Models/Role')
const Database = use('Database')

class BaseDefaultPermission {
  /**
  * Ask defaultPermission parameters
  *
  * @method askDefaultPermissionParameters
  *
  * @param  {Function} alwaysAsk
  *
  * @return {void}
  */
  async askDefaultPermissionParameters (alwaysAsk, resourceName) {
    // Asks for role slug
    if (!this.roleSlug) {
      this.roleSlug = await this
        .ask('Which role should I bind to this defaultPermission? (Use slug name)')
    }

    // Check if needs to always ask the defaultPermissions
    if (alwaysAsk || !this.defaultPermissionsArray) {
      let question = null

      if (alwaysAsk) {
        question = `What this role can do with ${resourceName} resource? (a = select all, space = mark option)`
      } else {
        question = 'What this role can do with the resources? (a = select all, space = mark option)'
      }

      this.defaultPermissionsArray = await this
        .multiple(question, [
          {
            name: 'Create',
            value: 'create'
          },
          {
            name: 'Read',
            value: 'read'
          },
          {
            name: 'Update',
            value: 'update'
          },
          {
            name: 'Delete',
            value: 'delete'
          }
        ])
    }

    if (!alwaysAsk) this.warn('This will apply the same default permissions to all resources. You can change it later 🤠')
  }

  /**
   * Creates a defaultPermission
   *
   * @method createDefaultPermission
   *
   * @param  {Object} resourceName
   *
   * @return {void}
   */
  async createDefaultPermission ({ resourceName }) {
    // Check if role exists
    const role = await Role.findBy('slug', this.roleSlug)
    if (!role) {
      Database.close()
      return this.error('Role not found')
    }

    // Check if resource exists
    const resource = await Resource.findBy('name', resourceName)
    if (!resource) {
      Database.close()
      return this.error('Resource not found')
    }

    // Function for defaultPermission checking
    const hasDefaultPermission = (defaultPermission) => ((this.defaultPermissionsArray.find((el) => el === defaultPermission)) ? true : false)

    // Create the defaultPermission
    await Database.transaction(async (trx) => {
      await DefaultPermission.create({
        role_id: role.id,
        resource_id: resource.id,
        create: hasDefaultPermission('create'),
        read: hasDefaultPermission('read'),
        update: hasDefaultPermission('update'),
        delete: hasDefaultPermission('delete')
      }, trx)
    })

    return this.info(`DefaultPermissions for ${resourceName} resource created successfully!`)
  }
}

module.exports = BaseDefaultPermission
