const { Server } = require('socket.io')

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

    socket.on('disconnect', () => {
      log(`\nClient ${socket.id} disconnected`)
    })
  })

  return io
}

module.exports = createApplication
