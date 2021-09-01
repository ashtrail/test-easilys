require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

app.use(express.static('public'))

server.listen(process.env.CLIENT_PORT, () => {
  console.log(`listening on *:${server.address().port}`)
})
