const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Plants Endpoints', function() {
    let db

    const { testUsers } = helpers.makeGreenhouseFixtures()
    const { testPlants } = helpers.makeGreenhouseFixtures()

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

    describe(`DELETE /api/plants/:username/:plant`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        )
        beforeEach('insert plants', () => 
            helpers.seedPlants(db, testUsers, testPlants)
        )

        context(`Given there are plants in the database associated with that user`, () => {
            it(`responds with 204 and removes the specified plant`, () => {
                const testUser = testUsers[0].user_name
                const idToRemove = 1
                const userPlants = testPlants.filter(plant => plant.user_id === testUsers[0].id)
                const expectedPlants = userPlants.filter(plant => plant.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/plants/${testUser}/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get(`/api/plants/${testUser}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedPlants)
                    })
            })
        })
    })

    describe(`PATCH /api/plants/:username/:plant`, () => {
        beforeEach('insert users', () => 
            helpers.seedUsers(db, testUsers)
        )
        beforeEach('insert plants', () => 
            helpers.seedPlants(db, testUsers, testPlants)
        )

        context('Given there are plants in the database associated with that user', () => {
            it('responds with 200 and updates the plant', () => {
                const testUser = testUsers[0].user_name
                const idToUpdate = 1
                const updatePlant = {
                    name: 'updated plant name',
                    family: 'updated plant family',
                    watered: new Date(),
                    notes: 'updated plant notes',
                    image: 'updatedplantimage.jpg'
                }
                const expectedPlant = {
                    ...testPlants[idToUpdate - 1],
                    ...updatePlant
                }
                return supertest(app)
                    .patch(`/api/plants/${testUser}/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(updatePlant)
                    .expect(200)
                    .then(res => {
                        supertest(app)
                            .get(`/api/plants/${testUser}/${idToUpdate}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedPlant)
                    })
            })

            it(`responds with 400 when given no required fields`, () => {
                const testUser = testUsers[0].user_name
                const idToUpdate = 1
                return supertest(app)
                    .patch(`/api/plants/${testUser}/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'name', 'family', 'watered', 'notes' or 'image'`
                        }   
                    })
            })

            it(`responds with 200 when updating only a subset of fields`, () => {
                const testUser = testUsers[0].user_name
                const idToUpdate = 1
                const updatePlant = {
                    name: 'updated plant name'
                }
                const expectedPlant = {
                    ...testPlants[idToUpdate - 1],
                    ...updatePlant
                }

                return supertest(app)
                    .patch(`/api/plants/${testUser}/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send({
                        ...updatePlant,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(200)
                    .then(res => {
                        supertest(app)
                            .get(`/api/plants/${testUser}/${idToUpdate}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedPlant)
                    })
            })
        })
    })
})