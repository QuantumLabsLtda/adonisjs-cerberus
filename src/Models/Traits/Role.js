'use strict'

module.exports = class HasRole {
  register (Model) {
    Model.prototype.role = function () {
      return this.hasOne('Cerberus/Models/Role')
    }
  }
}
