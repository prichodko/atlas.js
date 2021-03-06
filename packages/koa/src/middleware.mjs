import Hook from '@atlas.js/hook'
import hidden from 'local-scope/create'

class MiddlewareHook extends Hook {
  static defaults = {
    module: 'middleware',
    middleware: {},
  }
  static requires = [
    'service:koa',
  ]

  'application:prepare:after'() {
    // Load the middleware module from the user-specified directory, relative to root
    this::hidden().middleware = this.app.require(this.config.module)
  }

  'application:start:before'() {
    // Register all loaded middleware into the Koa instance
    const config = this.config
    const middleware = this::hidden().middleware
    const koa = this.component('service:koa')

    for (const [name, handler] of Object.entries(middleware)) {
      const options = config.middleware[name]
      koa.use(handler(options))
    }
  }
}

export default MiddlewareHook
