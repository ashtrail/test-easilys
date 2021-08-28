const { query } = require('../../db')

const createTable = async () => {
  await query(
    `
    CREATE TABLE matches (
      id SERIAL PRIMARY KEY,
      name varchar(200) NOT NULL,
      completed boolean NOT NULL
    );
  `
  )
}

const dropTable = async () => {
  await query('DROP TABLE IF EXISTS matches;')
}

const createOne = async (name, completed = false) => {
  await query(
    'INSERT INTO matches(name, completed) VALUES($1, $2) RETURNING *',
    [name, completed]
  )
}

const createMany = async (matches) => {
  for (match of matches) {
    await createOne(match.name, match.completed)
  }
}

module.exports = {
  createTable,
  dropTable,
  createOne,
  createMany,
}
