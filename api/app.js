const { Server } = require('socket.io')
const matchController = require('./src/match/match.controller')

const log = require('./src/logger')
const format = require('./src/formatter')

function createApplication(httpServer, serverOptions = {}) {
  const io = new Server(httpServer, serverOptions)

  io.on('connection', (socket) => {
    log(`\nClient ${socket.id} connected`)

    // Log all events received
    socket.onAny((eventName, args) => {
      log('\nReceived event:', {
        name: eventName,
        params: args,
      })
    })

    socket.on('ping', (callback) => {
      callback(format.response('pong'))
      socket.broadcast.emit('pinged', 'pong')
    })

    socket.on('match:create', matchController.create)
    socket.on('match:list', matchController.list)
    socket.on('match:get', matchController.getOne)
    socket.on('match:update', matchController.update)
    socket.on('match:delete', matchController.remove)

    socket.on('disconnect', () => {
      log(`\nClient ${socket.id} disconnected`)
    })
  })

  return io
}

module.exports = createApplication
