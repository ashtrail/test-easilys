require('dotenv').config()

const getDbName = () => {
  return process.env.NODE_ENV === 'test'
    ? process.env.DB_TEST_NAME
    : process.env.DB_DEV_NAME
}

const postgreConf = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

const getDbConf = () => {
  return { ...postgreConf, database: getDbName() }
}

module.exports = {
  postgreConf,
  getDbName,
  getDbConf,
}
