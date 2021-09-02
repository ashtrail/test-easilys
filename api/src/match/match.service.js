const { query } = require('../../db')

const createTable = async () => {
  await query(
    `
    CREATE TABLE matches (
      id SERIAL PRIMARY KEY,
      name varchar(200) NOT NULL,
      completed boolean NOT NULL,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL
    );
  `
  )
}

const dropTable = async () => {
  await query('DROP TABLE IF EXISTS matches;')
}

const createOne = async (name, completed = false) => {
  const now = new Date().toISOString()
  const res = await query(
    'INSERT INTO matches(name, completed, created_at, updated_at) VALUES($1, $2, $3, $3) RETURNING *',
    [name, completed, now]
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
  const now = new Date().toISOString()
  await query(
    `
      UPDATE matches
      SET name = $1, completed = $2, updated_at = $3
      WHERE id = $4
    `,
    [name, completed, now, id]
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
