const db = require('../../database/db-config.js')

module.exports = {
  add,
  find,
  findBy,
  findById,
}

// function getAll() {
//   console.log('getAll')
//   return db('users')
// }

function find() {
  return db('users').select('id', 'username').orderBy('id')
}

function findBy(filter) {
  return db('users').where(filter)
}

async function add(user) {
  const [id] = await db('users').insert(user)

  return findById(id)
}

function findById(id) {
  return db('users')
    .where({ id })
    .first()
}
