const { Pool } = require('pg')
const { getDbConf } = require('./db/utils')
const log = require('./src/logger')

const conf = getDbConf()
const pool = new Pool(conf)

module.exports = {
  async query(text, params) {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    if (process.env.LOG_DB_QUERIES === 'true') {
      log('Executed query', { text, duration, rows: res.rowCount })
    }
    return res
  },

  async close() {
    await pool.end()
  },
}
