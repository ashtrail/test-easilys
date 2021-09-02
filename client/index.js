require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

require('socket.io')(server)

app.use(express.static('public'))

const apiPort = process.env.API_PORT

app.get('/', function (_req, res) {
  res.render('index.ejs', { apiPort })
})

server.listen(process.env.CLIENT_PORT, () => {
  console.log(`listening on *:${server.address().port}`)
})
