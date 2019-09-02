const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'testemail1@gmail.com',
      user_name: 'test-user-1',
      password: 'Password1'
    },
    {
      id: 2,
      email: 'testemail2@gmail.com',
      user_name: 'test-user-2',
      password: 'Password2'
    },
    {
      id: 3,
      email: 'testemail3@gmail.com',
      user_name: 'test-user-3',
      password: 'Password3'
    },
    {
      id: 4,
      email: 'testemail4@gmail.com',
      user_name: 'test-user-4',
      password: 'Password4'
    },
  ]
}

function makePlantsArray(users) {
    return [
        {
            id: 1,
            name: 'plant one name',
            family: 'plant one family',
            watered: new Date('2029-01-22T16:28:32.615Z'),
            notes: 'plant one notes',
            image: 'plantoneimage.jpg',
            user_id: users[0].id
        },
        {
            id: 2,
            name: 'plant two name',
            family: 'plant two family',
            watered: new Date('2029-01-22T16:28:32.615Z'),
            notes: 'plant two notes',
            image: 'planttwoimage.jpg',
            user_id: users[1].id
        },
        {
            id: 3,
            name: 'plant three name',
            family: 'plant three family',
            watered: new Date('2029-01-22T16:28:32.615Z'),
            notes: 'plant three notes',
            image: 'plantthreeimage.jpg',
            user_id: users[2].id
        }
    ]
}

function makeGreenhouseFixtures() {
    const testUsers = makeUsersArray()
    const testPlants = makePlantsArray(testUsers)
    return { testUsers, testPlants }
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('greenhouse_users').insert(preppedUsers)
        .then(() =>
        // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('greenhouse_users_id_seq', ?)`, [users[users.length -1].id]
            )
        )
}

function seedPlants(db, plants) {
    return db.into('greenhouse_plants').insert(plants)
        .then(() => 
            db.raw(
                `SELECT setval('greenhouse_plants_id_seq', ?)`, [users[users.length -1].id]
            )
        )
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
            greenhouse_users,
            greenhouse_plants
        `
      )
      .then(() =>
        Promise.all([
            trx.raw(`ALTER SEQUENCE greenhouse_users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE greenhouse_plants_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('greenhouse_users_id_seq', 0)`),
            trx.raw(`SELECT setval('greenhouse_plants_id_seq', 0)`),
        ])
      )
    )
  }

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: `${user.email}`,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
    makePlantsArray,
    makeGreenhouseFixtures,
    seedUsers,
    seedPlants,
    cleanTables,
    makeAuthHeader
}