const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('persons API', () => {
  test('GET /api/persons returns json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unknown endpoint returns 404', async () => {
    await api.get('/api/unknown').expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
