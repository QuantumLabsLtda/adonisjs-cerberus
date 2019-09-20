#

<p align="center">
<img src="https://i.imgur.com/BDD0xWh.png" alt="Cerberus" title="Cerberus" align="center"/>
</p>

> A Hellhound that protects your API Endpoints... 😈

Cerberus is a library that adds roles, resources and permissions to [Auth System](https://github.com/adonisjs/adonis-auth) from [Adonis Framework](https://github.com/adonisjs/adonis-framework).

### Table of Contents

- [Concept](#concept)
- [Tables Diagram](#tables-diagram)
- [Setup](#setup)
- [Instructions](#instructions)
- [Usage](#usage)

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
<img src="https://i.imgur.com/NmeHECR.png" alt="Cerberus" title="Cerberus" align="center"/>
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

This command create a new *role* into roles table. You only need to specify the `name` of *role*, `slug` argument is optional.

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

This command create a new *resource* into resources table. You only need to specify the `name` of resource, `slug` argument is optional.
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

This command create a new *permission* into permissions table. You need to specify a Resource name then, *Cerberus* will create a permission record with the specified Resource *name*.

## Usage

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

## Errors

By default, Cerberus throw 2 types of errors:

1. `CERBERUS_ACCESS_DENIED`: This error occours when an *User* doesn't have the needed permissions for the specified *Resource*. The error *status code* is `403`.
2. `CERBERUS_RESOURCE_NOT_FOUND`: This error occours when you're trying to check for *permissions* in a *Resource* that doesn't exist. The error *status code* is `404`.

You can handle this errors manually for custom messages. Check [Adonis Framework Official Docs](https://adonisjs.com/docs/4.1/) and search for [Error Handling](https://adonisjs.com/docs/4.1/exceptions).

## Todo
- [ ] Add an option in `cerberus:resource` to run permission for every resource in database
- [ ] Option to create custom permission rights

## Credits
Logo icon made by [freepik](https://www.flaticon.com/authors/freepik) from [flaticon.com](https://www.flaticon.com). Customized by QuantumLabs.
