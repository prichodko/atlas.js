import Hook from '..'

describe('Hook: basics and API', () => {
  it('exists', () => {
    expect(Hook).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Hook()).to.not.throw()
  })

  it('has a static defaults property with an empty object', () => {
    expect(Hook.defaults).to.be.an('object')
    expect(Object.keys(Hook.defaults)).to.have.length(0)
  })

  it('has static type property se to hook', () => {
    expect(Hook.type).to.equal('hook')
  })

  it('saves app and log objects given on constructor to itself', () => {
    const app = { app: true }
    const log = { log: true }
    const hook = new Hook({
      app,
      log,
    })

    expect(hook).to.have.property('app', app)
    expect(hook).to.have.property('log', log)
  })
})
