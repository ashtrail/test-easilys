const matchService = require('./match.service')
const format = require('../formatter')
const log = require('../logger')

async function create(match, callback) {
  const socket = this
  try {
    const res = await matchService.createOne(match.name, match.completed)
    callback(format.response(res))
    socket.broadcast.emit('match:created', res)
  } catch (e) {
    log('Match creation error:', e)
    return callback(format.error())
  }
}

async function list(callback) {
  const matches = await matchService.getAll()
  return callback(format.response(matches))
}

async function getOne(id, callback) {
  const res = await matchService.getById(id)
  if (res === null) {
    return callback(format.error('not-found'))
  }
  return callback(format.response(res))
}

async function update(id, update, callback) {
  const socket = this
  try {
    const res = await matchService.updateById(id, update)
    if (res === null) {
      return callback(format.error('not-found'))
    }
    callback(format.response(res))
    socket.broadcast.emit('match:updated', res)
  } catch (e) {
    log('Match update error:', e)
    return callback(format.error())
  }
}

async function remove(id, callback) {
  const socket = this
  try {
    await matchService.deleteById(id)
    callback(format.response())
    socket.broadcast.emit('match:deleted', id)
  } catch (e) {
    log('Match deletion error:', e)
    return callback(format.error())
  }
}

module.exports = {
  create,
  list,
  getOne,
  update,
  remove,
}
