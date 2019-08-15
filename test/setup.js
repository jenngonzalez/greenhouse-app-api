const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest

process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.TEST_DB_URL = process.env.TEST_DB_URL || 'postgresql://greenhouse_admin@localhost/greenhouse_test'