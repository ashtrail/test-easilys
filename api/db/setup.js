const { postgreConf, getDbName } = require('./utils')
const { Client } = require('pg')

const dbName = getDbName()

async function createDatabase() {
  const client = new Client(postgreConf)

  await client.connect()
  await client.query(`DROP DATABASE IF EXISTS "${dbName}";`)
  await client.query(`CREATE DATABASE "${dbName}";`)
  await client.end()
}

async function setupDatabase() {
  await createDatabase()

  const db = require('../db')
  const matchService = require('../src/match/match.service')

  await matchService.createTable()
  await db.close()
}

setupDatabase()
  .then(() => {
    console.log(
      `Database successfully initiated for ${process.env.NODE_ENV} environment`
    )
    process.exit(0)
  })
  .catch((error) => {
    console.log('Error : ', error)
    process.exit(1)
  })
