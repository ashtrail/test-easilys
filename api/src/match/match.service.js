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
  const res = await query(
    'INSERT INTO matches(name, completed) VALUES($1, $2) RETURNING *',
    [name, completed]
  )
  return res.rows[0]
}

const createMany = async (matches) => {
  const result = []
  for (match of matches) {
    const entry = await createOne(match.name, match.completed)
    result.push(entry)
  }
  return result
}

const getAll = async () => {
  const res = await query('SELECT * FROM matches')
  return res.rows
}

const getById = async (id) => {
  const res = await query('SELECT * FROM matches WHERE id = $1', [id])
  return res.rows.length > 0 ? res.rows[0] : null
}

const updateById = async (id, { name, completed }) => {
  await query(
    `
      UPDATE matches
      SET name = $1, completed = $2
      WHERE id = $3
    `,
    [name, completed, id]
  )
  return getById(id)
}

const deleteById = async (id) => {
  return query('DELETE FROM matches WHERE id = $1', [id])
}

module.exports = {
  createTable,
  dropTable,
  createOne,
  createMany,
  getAll,
  getById,
  updateById,
  deleteById,
}
