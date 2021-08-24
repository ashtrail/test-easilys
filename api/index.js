require('dotenv').config()
const { createServer } = require('http')
const createApplication = require('./app')

const httpServer = createServer()

createApplication(httpServer, {
  cors: {
    origin: [`http://localhost:${process.env.CLIENT_PORT}`],
  },
})

httpServer.listen(process.env.API_PORT, () => {
  console.log(`listening on *:${httpServer.address().port}`)
})
