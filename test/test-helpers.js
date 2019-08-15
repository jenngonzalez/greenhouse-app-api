const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password'
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password'
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password'
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password'
    },
  ]
}

function makeGreenhouseFixtures() {
    const testUsers = makeUsersArray()
    return { testUsers }
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('greenhouse_users').insert(preppedUsers)
        .then(() =>
            db.raw(
                `SELECT setval('greenhouse_users_id_seq', ?)`, [users[users.length -1].id]
            ))
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE greenhouse_users`
      )
      .then(() =>
        Promise.all([
            trx.raw(`ALTER SEQUENCE greenhouse_users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('greenhouse_users_id_seq', 0)`)

        ])
      )
    )
  }

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
    makeGreenhouseFixtures,
    seedUsers,
    cleanTables,
    makeAuthHeader
}