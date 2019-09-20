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

#### Permission

```shell
  adonis cerberus:permission --resource-name <value>
```

This command create a new *permission* into permissions table. You need to specify a Resource name then, *Cerberus* will create a permission record with the specified Resource *name*.

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
