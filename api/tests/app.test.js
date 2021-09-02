const createApplication = require('../app')
const { createServer } = require('http')
const { io } = require('socket.io-client')
const db = require('../db')
const matchService = require('../src/match/match.service')

const MatchFactory = require('./factory')
const factory = new MatchFactory()

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
const assertionWrapper = async (done, partialDone, assertions) => {
  try {
    await assertions()
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

  afterAll(async () => {
    await db.close()
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

  describe('Matches', () => {
    beforeEach(async () => {
      // Clear match table in the database
      await matchService.dropTable()
      await matchService.createTable()
    })

    it('should create a match', (done) => {
      const partialDone = createPartialDone(2, done)

      const match = factory.build()

      socket.emit('match:create', match, (res) => {
        assertionWrapper(done, partialDone, () => {
          expect(res.status).toEqual('OK')
          expect(res.data.name).toEqual(match.name)
          expect(res.data.completed).toEqual(match.completed)
          expect(res.data.created_at).toEqual(res.data.updated_at)
        })
      })

      listenerSocket.on('match:created', (res) => {
        assertionWrapper(done, partialDone, () => {
          expect(res.name).toEqual(match.name)
          expect(res.completed).toEqual(match.completed)
        })
      })
    })

    it('should list all matches', (done) => {
      factory.createMany(3).then(() => {
        socket.emit('match:list', (res) => {
          expect(res.status).toEqual('OK')
          expect(res.data.length).toEqual(3)
          done()
        })
      })
    })

    it('should get a match', (done) => {
      factory.create().then((match) => {
        socket.emit('match:get', match.id, (res) => {
          expect(res.status).toEqual('OK')
          expect(res.data.name).toEqual(match.name)
          expect(res.data.completed).toEqual(match.completed)
          done()
        })
      })
    })

    it('should update a match', (done) => {
      const partialDone = createPartialDone(2, done)

      factory.create().then((match) => {
        expect(match.completed).toEqual(false)

        const update = { ...match, completed: true }

        socket.emit('match:update', match.id, update, (res) => {
          assertionWrapper(done, partialDone, () => {
            expect(res.status).toEqual('OK')
            expect(res.data.completed).toEqual(true)
            expect(res.data.created_at).not.toEqual(res.data.updated_at)
          })
        })

        listenerSocket.on('match:updated', (res) => {
          assertionWrapper(done, partialDone, () => {
            expect(res.id).toEqual(match.id)
            expect(res.completed).toEqual(true)
          })
        })
      })
    })

    it('should delete a match', (done) => {
      const partialDone = createPartialDone(2, done)

      factory.create().then(({ id }) => {
        socket.emit('match:delete', id, (res) => {
          assertionWrapper(done, partialDone, async () => {
            expect(res.status).toEqual('OK')

            // check it's been deleted from db
            const m = await matchService.getById(id)
            expect(m).toEqual(null)
          })
        })

        listenerSocket.on('match:deleted', (res) => {
          assertionWrapper(done, partialDone, () => {
            expect(res).toEqual(id)
          })
        })
      })
    })

    it('should return error when match id is not found', (done) => {
      const partialDone = createPartialDone(2, done)

      const fakeId = 42

      socket.emit('match:get', fakeId, (res) => {
        assertionWrapper(done, partialDone, async () => {
          expect(res.status).toEqual('KO')
          expect(res.error.type).toEqual('not-found')
        })
      })

      const fakeMatch = factory.build()
      socket.emit('match:update', fakeId, fakeMatch, (res) => {
        assertionWrapper(done, partialDone, async () => {
          expect(res.status).toEqual('KO')
          expect(res.error.type).toEqual('not-found')
        })
      })
    })
  })
})
