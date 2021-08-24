const createApplication = require('../app')
const { createServer } = require('http')
const { io } = require('socket.io-client')

// Require the completion of a specific number of async tasks
// before calling done()
const createPartialDone = (count, done) => {
  let i = 0
  return () => {
    if (++i === count) {
      done()
    }
  }
}

// Avoid redundant code duplication
const assertionWrapper = (done, partialDone, assertions) => {
  try {
    assertions()
    partialDone()
  } catch (error) {
    done(error)
  }
}

describe('Server', () => {
  let httpServer, socket, listenerSocket

  beforeEach((done) => {
    const partialDone = createPartialDone(2, done)

    httpServer = createServer()

    createApplication(httpServer)

    httpServer.listen(() => {
      const port = httpServer.address().port
      // We use this socket to send events and check their callbacks
      socket = io(`http://localhost:${port}`)
      socket.on('connect', partialDone)

      // We use this one to check if events trigger the correct broadcasts
      listenerSocket = io(`http://localhost:${port}`)
      listenerSocket.on('connect', partialDone)
    })
  })

  afterEach(() => {
    httpServer.close()
    socket.disconnect()
    listenerSocket.disconnect()
  })

  it('should ping', (done) => {
    const partialDone = createPartialDone(2, done)

    socket.emit('ping', (res) => {
      assertionWrapper(done, partialDone, () => {
        expect(res.status).toEqual('OK')
        expect(res.data).toEqual('pong')
      })
    })

    listenerSocket.on('pinged', (res) => {
      assertionWrapper(done, partialDone, () => {
        expect(res).toEqual('pong')
      })
    })
  })
})
