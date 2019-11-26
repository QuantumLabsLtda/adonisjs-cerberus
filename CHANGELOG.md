# [2.0.0](https://github.com/QuantumLabsLtda/adonisjs-cerberus/compare/1.1.2...2.0.0) (2019-11-26)


### Bug Fixes

* **database/migrations/permission_schema.js:** fix permission migration drop table name ([5b87d27](https://github.com/QuantumLabsLtda/adonisjs-cerberus/commit/5b87d275e77d81a8f6c46b819b4056cb9ff52b17))


### Code Refactoring

* **permissions:** default permissions for each role and resource ([e6dcc97](https://github.com/QuantumLabsLtda/adonisjs-cerberus/commit/e6dcc97d6e47ad602ec03c53b807adfedb91dd1c))


### BREAKING CHANGES

* **permissions:** the default permissions are now used when creating a new resource



## [1.1.2](https://github.com/QuantumLabsLtda/adonisjs-cerberus/compare/1.1.1...1.1.2) (2019-10-01)


### Bug Fixes

* **commands/resource.js:** add support to recursive folders in from models and controllers folder ([1b5de57](https://github.com/QuantumLabsLtda/adonisjs-cerberus/commit/1b5de57969b361bf26682b6972332e095b1d1a9f)), closes [#7](https://github.com/QuantumLabsLtda/adonisjs-cerberus/issues/7)



## [1.1.1](https://github.com/QuantumLabsLtda/adonisjs-cerberus/compare/1.1.0...1.1.1) (2019-09-27)


### Bug Fixes

* **src/cerberus.js:** fix permission check for 'delete' right ([ac7744d](https://github.com/QuantumLabsLtda/adonisjs-cerberus/commit/ac7744d215a88b42b35979b4c51f92cafa0e46d8)), closes [#6](https://github.com/QuantumLabsLtda/adonisjs-cerberus/issues/6)


### Features

* **pakcage.js/japafile.js/util.spec.js:** set the suit test & wrote first test ([#5](https://github.com/QuantumLabsLtda/adonisjs-cerberus/issues/5)) ([add2a34](https://github.com/QuantumLabsLtda/adonisjs-cerberus/commit/add2a349d92f7dc7ae99c403f22270ea55168156))


# [1.1.0](https://github.com/QuantumLabsLtda/adonisjs-cerberus/compare/1.0.1...1.1.0) (2019-09-20)

### Features

* **[commands/Permission.js](commands/Permission.js):** added option `-a, --all` in `adonis cerberus:permission` command
* **[README.md](README.md):** added --all command option in `adonis cerberus:permission` command
* **[instructions.md](instructions.md):**  added --all command option in `adonis cerberus:permission` command

## [1.0.1](https://github.com/QuantumLabsLtda/adonisjs-cerberus/compare/1.0.0...1.0.1) (2019-09-20)

### Bug Fixes

* **[README.md:](README.md:)** fixed README commands order
* **[instructions.md:](instructions.md:)** fixed instructions commands order
* **[database/migrations/permission_schema.js](database/migrations/permission_schema.js):** removed resource_id unique constraint
