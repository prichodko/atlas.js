import Service from '..'

describe('Service: basics and API', () => {
  it('exists', () => {
    expect(Service).to.be.a('function')
  })

  it('can be constructed', () => {
    expect(() => new Service()).to.not.throw()
  })

  it('has a static defaults property with an empty object', () => {
    expect(Service.defaults).to.be.an('object')
    expect(Object.keys(Service.defaults)).to.have.length(0)
  })

  it('has static type property se to service', () => {
    expect(Service.type).to.equal('service')
  })

  it('implements methods each Service should have', () => {
    const service = new Service()

    expect(service).to.respondTo('prepare')
    expect(service).to.respondTo('start')
    expect(service).to.respondTo('stop')
  })

  it('all those methods are synchronous', () => {
    const service = new Service()

    expect(service.prepare()).to.not.be.a('promise')
    expect(service.start()).to.not.be.a('promise')
    expect(service.stop()).to.not.be.a('promise')
  })

  it('saves app and log objects given on constructor to itself', () => {
    const app = { app: true }
    const log = { log: true }
    const service = new Service({
      app,
      log,
    })

    expect(service).to.have.property('app', app)
    expect(service).to.have.property('log', log)
  })
})
