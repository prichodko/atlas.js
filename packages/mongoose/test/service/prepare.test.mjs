import { Service as Mongoose } from '../..'
import mongoose from 'mongoose'

describe('Mongoose::prepare()', () => {
  let service
  let instance

  beforeEach(async () => {
    service = new Mongoose({
      app: {},
      log: {},
      config: {},
    })

    instance = await service.prepare()
  })


  it('exists', () => {
    expect(service).to.respondTo('prepare')
  })

  it('returns mongoose instance', async () => {
    expect(await service.prepare()).to.be.instanceof(mongoose.Mongoose)
  })

  it('configures instance to use global Promise', () => {
    expect(instance.Promise.ES6).to.equal(global.Promise)
  })

  it('sets a debug function to log model events', async function() {
    this.sandbox.stub(Object.getPrototypeOf(instance), 'set')

    await service.prepare()

    expect(instance.set).to.have.callCount(1)
    expect(instance.set).to.have.been.calledWith('debug')
    expect(instance.set.firstCall.args[1]).to.be.a('function')
  })
})
