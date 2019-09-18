/* eslint-disable no-unneeded-ternary */
const Permission = use('Cerberus/Models/Permission')
const Resource = use('Cerberus/Models/Resource')
const Role = use('Cerberus/Models/Role')
const Database = use('Database')

class BasePermission {
  /**
  * Ask permission parameters
  *
  * @method askPermissionParameters
  *
  * @param  {Function} alwaysAsk
  *
  * @return {void}
  */
  async askPermissionParameters (alwaysAsk, resourceName) {
    // Asks for role slug
    if (!this.roleSlug) {
      this.roleSlug = await this
        .ask('Which role should I bind to this permission? (Use slug name)')
    }

    // Check if needs to always ask the permissions
    if (alwaysAsk || !this.permissionsArray) {
      let question = null

      if (alwaysAsk) {
        question = `What this role can do with ${resourceName} resource? (a = select all, space = mark option)`
      } else {
        question = 'What this role can do with the resources? (a = select all, space = mark option)'
      }

      this.permissionsArray = await this
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

    if (!alwaysAsk) this.warn('This will apply the same permissions to all resources. You can change it later 🤠')
  }

  /**
   * Creates a permission
   *
   * @method createPermission
   *
   * @param  {Object} resourceName
   *
   * @return {void}
   */
  async createPermission ({ resourceName }) {
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

    // Function for permission checking
    const hasPermission = (permission) => ((this.permissionsArray.find((el) => el === permission)) ? true : false)

    // Create the permission
    await Database.transaction(async (trx) => {
      await Permission.create({
        role_id: role.id,
        resource_id: resource.id,
        create: hasPermission('create'),
        read: hasPermission('read'),
        update: hasPermission('update'),
        delete: hasPermission('delete')
      }, trx)
    })

    return this.info(`Permissions for ${resourceName} resource created successfully!`)
  }
}

module.exports = BasePermission
