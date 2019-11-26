#

<p align="center">
<img src="https://i.imgur.com/BDD0xWh.png" alt="Cerberus" title="Cerberus" align="center"/>
</p>

> A Hellhound that protects your API Endpoints... 😈

[![npm version](https://badge.fury.io/js/%40quantumlabs%2Fadonisjs-cerberus.svg)](https://badge.fury.io/js/%40quantumlabs%2Fadonisjs-cerberus)

Cerberus is a library that adds roles, resources and permissions to [Auth System](https://github.com/adonisjs/adonis-auth) from [Adonis Framework](https://github.com/adonisjs/adonis-framework).

### Table of Contents

- [Concept](#concept)
- [Tables Diagram](#tables-diagram)
- [Setup](#setup)
- [Instructions](#instructions)
- [Usage](#usage)
  - [Using in routes](#using-in-routes)
  - [Consuming Models](#consuming-models)
    - [Roles](#roles)
    - [Resources](#resources)
    - [DefaultPermissions](#defaultpermissions)
    - [Permissions](#permissions)
    - [Binding User to Role](#binding-user-to-role)
    - [Inheriting rights from DefaultPermissions](#inheriting-rights-from-defaultpermissions)
- [Commands](#commands)
  - [Init](#init)
  - [DefaultPermission](#default-permission)  
  - [Resource](#resource)  
  - [Role](#role)  

- [Errors](#errors)
- [Tips](#tips)

## Concept
Cerberus is a collection of models, commands, migrations and a middleware to help you managing User Access Rights in an Adonis.js API.

**Warning*: Cerberus doesn't **yet** manage *Controllers* and *Routes* for you. You'll need to create your custom methods using Cerberus Models.*

To start using Cerberus properly, you need to understand some basic concepts behind the library. There are 3 main pillars (A.K.A Cerberus Heads), they are:

1. Roles
2. Resources
3. Permissions

A **Role** is an User responsabilty in your API (e.g., Admin, Moderator, User, Seller, etc.).

A **Resource** can be a *Controller*, *Model* or any resource in your API that you want to protect (e.g., User, Profile, Post, etc.).

And we have **Permissions**. A **Permission** is basically the junction of *Role* and a *Resource*, with boolean values for each access right that a *Role* should give to a specific `user_id`. With **Permissions** we also have **DefaultPermissions**, they are *Role*-specific default values for **Permissions** boolean accesses.
Every new *Permission*, should inherit from *DefaultPermission* rights, but they can assume whatever value you want.

The accesses are:

1. Create
2. Read
3. Update
4. Delete

Then, you can create **Roles** with **DefaultPermissions** and give **Permissions** to specific **Resources** and **Users**.

E.g.: You can create an "Admin" *Role* with a *DefaultPermission* to "Posts" *Resource*, and using the *Permission* model you can create a specific *Permission* to your User.

*Role*
```json
{
  "id": 1,
  "name": "Admin",
  "slug": "admin"
}
```

*Resource*
```json
{
  "id": 4,
  "name": "Posts",
  "slug": "posts"
}
```

*DefaultPermission*
```json
{
  "id": 1,
  "resourceId": 4,
  "roleId": 1,
  "create": true,
  "read": true,
  "update": true,
  "delete" : true
}
```

*Permission*
```json
{
  "id": 1,
  "resourceId": 4,
  "roleId": 1,
  "userId": 1,
  "create": true,
  "read": true,
  "update": true,
  "delete" : true
}
```

The **Guard** middleware **will check values against Permission record, not DefaultPermission values.**

## Tables diagram

<p align="center">
<img src="https://i.imgur.com/2vi2KRo.png" alt="Cerberus" title="Cerberus" align="center"/>
</p>

## Setup

Install package using npm.

```shell
  adonis install @quantumlabs/adonisjs-cerberus
```

or

```shell
  npm i @quantumlabs/adonisjs-cerberus --save
```

Warning: If you choose `npm install` instead of `adonis install`, you'll need to open `instructions.md` manually.

## Instructions

1. Add Cerberus into providers Array, inside `start/app.js` file of your project:

```js
  const providers = [
    ...
    '@quantumlabs/adonisjs-cerberus/providers/CerberusProvider',
    ...
  ]
```

2. Add Cerberus into aceProviders Array, inside `start/app.js` file of your project:

```js
  const aceProviders = [
    ...
    '@quantumlabs/adonisjs-cerberus/providers/CommandsProvider'
    ...
  ]
```

3. Add Cerberus Middleware into namedMiddleware Array, inside `start/kernel.js` file of your project:

```js
  const namedMiddleware = [
    ...
    guard: 'Cerberus/Middleware/Guard'
    ...
  ]
```

4. Add Cerberus special [Traits](https://adonisjs.com/docs/4.1/traits) inside your `app/Models/User` Model, like this:

```js
class User extends Model {
  static boot () {
    super.boot()

    this.addTrait('@provider:Cerberus/Traits/Role')
    this.addTrait('@provider:Cerberus/Traits/Permission')
  }
...
```

5. If you're using [Objection.js](https://vincit.github.io/objection.js/)'s [Snake case to camel conversion](https://vincit.github.io/objection.js/recipes/snake-case-to-camel-case-conversion.html), you should add this property at the end of your project `config/database.js` file:

```js
  ...
  usingSnakeCaseMappers: true
}
```

6. Finally, you need to run:

```shell
  adonis cerberus:init
```

This command will copy all library specific migrations into your project `migrations` folder.

*Warning*: Cerberus creates a migration for `users` table, adding a `role_id` column, which is a foreing key from `roles`. You **should** take a look in the migration before running it in production!

## Commands

#### Init

```shell
  adonis cerberus:init
```

As mentioned before, this command should (and we hope it will) copy all library specific migration into your projects `migrations` folder. There's no special flags or parameters for this command.

#### Role

```shell
adonis cerberus:role [name] [slug]

Usage:
  cerberus:role <name> [slug] [options]

Arguments:
  name   Name of the role
  slug   Short name for role
```

This command creates a new *role* into roles table. You only need to specify role's `name`, `slug` argument is optional.

#### Resource

```shell
adonis cerberus:resource [name] [slug] [options]

Arguments:
  name               Name of the resource
  slug               Short name for resource

Options:
  -p, --defaultPermission   Generate default permissions
  -a, --always-ask   Ask which rights give in each Resource once (false by default)
  --from-models      Generate a resource for each app Model
  --from-controllers Generate a resource for each app Controller
```

This command creates a new *resource* into resources table. You only need to specify the `name` of resource, the `slug` argument is optional.
The options are:
  `-p, --defaultPermission` - Generate default permissions
  `-a, --always-ask` - Ask which rights give in each Resource once (false by default)
  `--from-models` - Generate a resource for each app Model
  `--from-controllers` - Generate a resource for each app Controller

#### Default Permission

```shell
cerberus:defaultPermission [options]

Options:
  -a, --all               Run default permission creation for each Resource in database
  --resource-name <value> Name of resource
```

This command creates a new *default permission* into default_permissions table. You need to specify a Resource name, then, *Cerberus* creates a default permission record with the specified Resource *name*.

## Usage

## Using in routes

After creating your *Permissions*, you'll be able to start using **Guard** middleware in your routes.

It's simple to bind a permission into a route, look:

```js
/**
* Get all users
* GET users
*/
Route
  .get('', 'UserController.index')
  .middleware(['auth', 'guard: user.read'])
```

You can also use multiple permissions in your route:

```js
/**
* Create a new user
* POST users/register
*/
Route
  .post('register', 'UserController.register')
  .middleware(['auth', 'guard: users.create, users.read'])
```

And it's possible to use multiple resources too:

```js
/**
* Fetch all posts with user profile
* GET posts
*/
Route
  .get('', 'PostController.index')
  .middleware(['auth', 'guard: post.read, user.read'])
```

*Warning*: You need to add the default `auth` middleware **before** Cerberus `guard`!

### Consuming Models

You **should** use Cerberus Models to create *Roles*, *Resources* and *Permissions* in your own code. It's also useful for creating seeds or a complete CRUD to manage your Cerberus stuff. It's simple to use:

#### Roles

```js
  const Role = use('Cerberus/Models/Role')

  // Creating a new Role
  await Role.create({
    name: 'Jedi Master',
    slug: 'jedi'
  })

  // or

  let role = await Role.find(1)

  role.name = 'Wookie'
  role.slug = 'wookie'

  await role.save()

  // You can use any Lucid methods you want
```

#### Resources

```js
  const Resource = use('Cerberus/Models/Resource')

  // Creating a new Resource
  await Resource.create({
    name: 'Lightsaber',
    slug: 'lightsaber'
  })

  // or

  let resource = await Resource.find(1)

  resource.name = 'Force'
  resource.slug = 'force'

  await resource.save()

  // You can use any Lucid methods you want
```

#### DefaultPermissions

```js
  const DefaultPermission = use('Cerberus/Models/DefaultPermission')

  // Creating a new DefaultPermission
  await Permission.create({
    role_id: role.id,
    resource_id: resource.id,
    create: false,
    read: true,
    update: false,
    delete: false
  })

  // or

  let defaultPermission = await DefaultPermission.find(1)

  defaultPermission.create = true
  defaultPermission.update = true

  await defaultPermission.save()

  // You can use any Lucid methods you want
```

#### Permissions

```js
  const Permission = use('Cerberus/Models/Permission')

  // Creating a new Permission
  await Permission.create({
    role_id: role.id,
    user_id: user.id,
    resource_id: resource.id,
    create: false,
    read: true,
    update: false,
    delete: false
  })

  // or

  let permission = await Permission.find(1)

  permission.create = true
  permission.update = true

  await permission.save()

  // You can use any Lucid methods you want
```

#### Binding User to Role

You can simply bind an existing **User** to a **Role**:

```js
  const User = use('App/Models/User')
  
  // Fetches the current user
  let user = await User.find(1)

  // Set the role Id
  user.role_id = 1

  await user.save()
```

#### Inheriting rights from DefaultPermissions

You can inherit rights from DefaultPermissions to Permission:

```js
  const DefaultPermission = use('Cerberus/Models/DefaultPermission')
  const Permission = use('App/Models/Permission')
  const User = use('App/Models/User')
  
  // Fetches the current user
  let user = await User.find(1)

  // Get the default permission
  let defaultPermission = await DefaultPermission
      .query()
      .where('resourceId', resource.id)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .fetch()

  defaultPermission = defaultPermission.first()

  if (defaultPermission) {
    // Create the default permission
    await Permission.create({
        roleId,
        user_id: user.id,
        resourceId: resource.id,
        create: defaultPermission.create,
        read: defaultPermission.read,
        update: defaultPermission.update,
        delete: defaultPermission.delete
      })
  }
```

## Errors

By default, Cerberus throw 2 types of errors:

1. `CERBERUS_ACCESS_DENIED`: This error occours when an *User* doesn't have the needed permissions for the specified *Resource*. The error *status code* is `403`.
2. `CERBERUS_RESOURCE_NOT_FOUND`: This error occours when you're trying to check for *permissions* in a *Resource* that doesn't exist. The error *status code* is `404`.

You can handle this errors manually for custom messages. Check [Adonis Framework Official Docs](https://adonisjs.com/docs/4.1/) and search for [Error Handling](https://adonisjs.com/docs/4.1/exceptions).

## Tips

**SQLite** - If you're using SQLite, you may notice a bug when running `user` migrations. This happens because SQLite doesn't support `ALTER TABLE` with a constraint. [Here](https://www.sqlite.org/omitted.html) you can find info about this issue in SQLite's [official docs](https://www.sqlite.org/docs.html). I suggest you to create `role_id` foreign key manually in your `user` migration.

## Todo

- [x] Add an option in `adonis cerberus:permission` to run permission for every resource in database
- [ ] Option to create custom permission rights
- [ ] Methods for easy permission, role and resource binding
- [ ] Setting a test utility and write tests for the existing code

## Credits
Logo icon made by [freepik](https://www.flaticon.com/authors/freepik) from [flaticon.com](https://www.flaticon.com). Customized by QuantumLabs.
