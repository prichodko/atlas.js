# First steps

## Installation

All projects will need the `@atlas.js/core` package, which provides all the important bits and pieces you will need on a standalone project.

`npm i --save @atlas.js/core`

This package includes the following:

- `Application`: The main class which holds all your components
- `Service` / `Action` / `Hook`: These classes are used when developing custom components - you will need to extend them
- `errors`: This object contains references to all the errors that @atlas.js can explicitly throw at you

You start your app by importing the `Application` class:

```js
import { Application } from '@atlas.js/core'
```

Then, you will need to create an instance of the `Application` class and provide some information to it:

- `root`: The path to where all other paths will be relative to. This is usually the folder where your *package.json* is located or the *src/* folder. It is safe to generally use the `__dirname` variable when specifying `root`.
- `env`: The environment name under which the app will run. This defaults to whatever is set in `NODE_ENV` env var, but if it is not set an exception will be thrown.
- `config`: The configuration for the application. It must contain configuration for all services, actions and hooks you plan on adding to the application in next steps. This can either be an object with all the config options or, it may be a path to a module from where the configuration will be loaded.

```js
const app = new Application({
  // All paths will be relative to this directory. Required.
  root: __dirname,
  // Some components may customise their behaviour based on this value. If you always set NODE_ENV, you do not need to provide a value here
  env: 'development',
  // The config for all components and the application itself. While
  // technically optional, you won't get far with just the defaults.
  config: {
    actions: {},
    services: {},
    hooks: {},
    application: {},
  },
})
```

## Configuration

It is recommended to use a path in the `config` parameter instead of passing the configuration object directly - this brings some extra functionality for free:

- The base config will be loaded from the module at the location you specify
- An environment-specific config will be loaded from within that directory's *env/* dir, so if our main config resides in *config/index.js* and we set `env` to *development*, *config/env/development.js* will be loaded and merged into the base config as well
- One extra config file, *local.js*, in the config directory, will be loaded and merged on top of the config object. This file **should be in your _.gitignore_** - its purpose is to allow developers to customise the application configuration to suit their local development workflow without modifying the global configuration.

```js
const app = new Application({
  root: __dirname,
  env: 'development',
  // This will load the following, relative to `root`:
  // - src/config/index.js or src/config.js (required)
  // - src/config/env/development.js or src/config/env/development/index.js (optional)
  // - src/config/local.js (optional)
  config: 'src/config',
})
```

Alternatively, you can manage your config yourself and just pass a plain JS object in the `config`:

```js
const app = new Application({
  config: {
    // Configuration for all services
    services: {},
    // Configuration for all actions
    actions: {},
    // Configuration for all hooks
    hooks: {},
    // Configuration for the Application instance itself
    application: {}
  }
})
```

## Using components

Next step is to add some components to your app! You can write your own, or you can use one of the "official" components. Let's add a Nodemailer service to our app.

`npm i --save @atlas.js/nodemailer`

```js
import * as Nodemailer from '@atlas.js/nodemailer'

const app = new Application({
  config: {
    services: {
      mailer: {
        transport: require('nodemailer-ses-transport')
      }
    }
  }
})
app.service('mailer', Nodemailer.Service)
// There is also:
app.action()
app.hook()
// These are further explained in other tutorials.
```

**Important**: You can name your components in any way you like. In the example above, we used `mailer`. This name is important for several reasons:

- The component's configuration will be expected at that particular key in the configuration
- The service itself will be accessible on the app instance under that particular name, so in this case at `app.services.mailer`

### Component order

The order in which you add services to the Application instance **is important**. The services will be started in the **exact same order** you added them to the application. This is important because most apps will need some kind of database service and some kind of public API, ie. an http server service. If you would start the http service before you started your database service, it might happen that a request arrives **before** the application is connected to the database! 😱 You certainly do not want that!

### Dependencies on other components

Sometimes, some component requires another component to work properly - a good example is the `MiddlewareHook` from the `@atlas.js/koa` package. This hook loads middleware from a module you specify and adds it to the Koa instance exposed from the Koa service. However, there is a problem: since the component can have a name that you, the end user, specify, the hook needs a way to locate that service. That's where **aliases** come into play.

#### Aliases

Some components declare their dependencies in their documentation and you can also discover them as a static properties on the `Component.requires` array (ie. on `MiddlewareHook.requires`, you will find `['service:koa']`).

You must resolve these dependencies for each component when you want to use it. You can do it via third argument to the `app.service()`, `app.hook()` or `app.action()` methods:

```js
app.service('http', Koa.Service)
app.hook('middleware', Koa.MiddlewareHook, {
  aliases: {
    'service:koa': 'http'
  }
})
```

That `service:koa` is declared in the package's documentation. The `http` is the name that **you chose** to use for the Koa service.

Now you have told the `MiddlewareHook` that the Koa service can be found under `app.services.http`. All is good! 🎉
