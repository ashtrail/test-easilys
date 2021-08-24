const log = require('./logger')

module.exports = {
  response: (body) => {
    const res = {
      status: 'OK',
      data: body,
    }
    log('Sent back response:', res)
    return res
  },

  error: (body) => {
    const error = {
      status: 'KO',
      error: body,
    }
    log('Sent back error:', res)
    return error
  },
}
