const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Plants Endpoints', function() {
    let db

    const { testUsers } = helpers.makeGreenhouseFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/plants`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        )

        it(`creates a plant, responding with 201 and the new plant`, function() {
            const testUser = testUsers[0]
            const newPlant = {
                name: 'test plant name',
                family: 'test plant family',
                notes: 'test plant notes'
            }
            return supertest(app)
                .post('/api/plants')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newPlant)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.name).to.eql(newPlant.name)
                    expect(res.body.family).to.eql(newPlant.family)
                    expect(res.body.notes).to.eql(newPlant.notes)
                    expect(res.body.user.id).to.eql(testUser.id)
                    expect(res.headers.location).to.eql(`/api/plants/${res.body.id}`)
                })
                .expect(res =>
                    db
                        .from('greenhouse_plants')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.name).to.eql(newPlant.name)
                            expect(row.family).to.eql(newPlant.family)
                            expect(row.notes).to.eql(newPlant.notes)
                            expect(row.user_id).to.eql(testUser.id)
                        })
                )
        })

        it(`responds with 400 and an error message when the name field is missing`, function() {

            const newPlant = {
                family: 'test plant family',
                notes: 'test plant notes'
            }

            return supertest(app)
                .post('/api/plants')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newPlant)
                .expect(400, {
                    error: `Missing plant name in request body`
                })
        })
    })
})