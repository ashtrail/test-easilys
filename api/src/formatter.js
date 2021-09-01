const log = require('./logger')

module.exports = {
  response: (body = {}) => {
    const res = {
      status: 'OK',
      data: body,
    }
    log('Sent back response:', res)
    return res
  },

  error: (type = 'unknown', details = {}) => {
    const error = {
      status: 'KO',
      error: {
        type,
        details,
      },
    }
    log('Sent back error:', error)
    return error
  },
}
