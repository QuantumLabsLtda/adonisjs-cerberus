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
    - [Permissions](#permissions)
    - [Binding User to Role](#binding-user-to-role)
- [Commands](#commands)
  - [Init](#init)
  - [Permission](#permission)  
  - [Resource](#resource)  
  - [Role](#role)  

- [Errors](#errors)

## Concept

To start using Cerberus properly, you need to understand some basic concepts behind the library. There are 3 main pillars (A.K.A Cerberus Heads), they are:

1. Roles
2. Resources
3. Permissions

A **Role** is an User responsabilty in your API (e.g., Admin, Moderator, User, Seller, etc.).

A **Resource** can be a *Controller*, *Model* or any resource in your API that you want to protect (e.g., User, Profile, Post, etc.).

And last but not least, we have **Permissions**. A **Permission** is basically the junction of a *Role* and a *Resource*, with boolean values for each access right that the role should have.

The accesses are:

1. Create
2. Read
3. Update
4. Delete

Then, you can create **Roles** and give **Permissions** to specific **Resources**.

## Tables diagram

<p align="center">
<img src="https://i.imgur.com/6urqQFn.png" alt="Cerberus" title="Cerberus" align="center"/>
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

As mentioned before, this command should (and we hope it will) copy all library specific migrations into your project `migrations` folder. There's no special flags or parameters for this command.

#### Role

```shell
adonis cerberus:role [name] [slug]

Usage:
  cerberus:role <name> [slug] [options]

Arguments:
  name   Name of the role
  slug   Short name for role
```

This command creates a new *role* into roles table. You only need to specify the `name` of *role*, `slug` argument is optional.

#### Resource

```shell
adonis cerberus:resource [name] [slug] [options]

Arguments:
  name               Name of the resource
  slug               Short name for resource

Options:
  -p, --permission   Generate permissions
  -a, --always-ask   Ask which permissions give in each Resource once (false by default)
  --from-models      Generate a resource for each app Model
  --from-controllers Generate a resource for each app Controller
```

This command creates a new *resource* into resources table. You only need to specify the `name` of resource, `slug` argument is optional.
The options are:
  `-p, --permission` - Generate permissions
  `-a, --always-ask` - Ask which permissions give in each Resource once (false by default)
  `--from-models` - Generate a resource for each app Model
  `--from-controllers` - Generate a resource for each app Controller

#### Permission

```shell
cerberus:permission [options]

Options:
  -a, --all               Run permission creation for each Resource in database
  --resource-name <value> Name of resource
```

This command creates a new *permission* into permissions table. You need to specify a Resource name then, *Cerberus* will create a permission record with the specified Resource *name*.

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

You can use the Cerberus Models to create *Roles*, *Resources* and *Permissions* in your own code, for creating seeds or a CRUD to manage Cerberus stuff. It's simple:

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

#### Permissions

```js
  const Permission = use('Cerberus/Models/Permission')

  // Creating a new Permission
  await Permission.create({
    role_id: role.id,
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

## Errors

By default, Cerberus throw 2 types of errors:

1. `CERBERUS_ACCESS_DENIED`: This error occours when an *User* doesn't have the needed permissions for the specified *Resource*. The error *status code* is `403`.
2. `CERBERUS_RESOURCE_NOT_FOUND`: This error occours when you're trying to check for *permissions* in a *Resource* that doesn't exist. The error *status code* is `404`.

You can handle this errors manually for custom messages. Check [Adonis Framework Official Docs](https://adonisjs.com/docs/4.1/) and search for [Error Handling](https://adonisjs.com/docs/4.1/exceptions).

## Todo

- [x] Add an option in `adonis cerberus:permission` to run permission for every resource in database
- [ ] Option to create custom permission rights
- [ ] Methods for easy permission, role and resource binding
- [ ] Setting a test utility and write tests for the existing code

## Credits
Logo icon made by [freepik](https://www.flaticon.com/authors/freepik) from [flaticon.com](https://www.flaticon.com). Customized by QuantumLabs.
