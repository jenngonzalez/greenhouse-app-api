const app = require('../src/app')


describe('App', () => {
    it('GET / responds with 200 containing "Greenhouse server running!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Greenhouse server running!')
    })
})