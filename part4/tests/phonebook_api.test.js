const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Person = require('../models/person')
const User = require('../models/user')

const api = supertest(app)

describe('phonebook API', () => {
  let authToken

  beforeEach(async () => {
    await Person.deleteMany({})
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send({ username: 'testuser', name: 'Test User', password: 'secret123' })
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'secret123' })
    authToken = loginRes.body.token
    await Person.insertMany([
      { name: 'Arto Hellas', number: '040-123456' },
      { name: 'Ada Lovelace', number: '39-44-5323523' }
    ])
  })

  test('all persons are returned as JSON', async () => {
    const response = await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(2)
    const names = response.body.map((p) => p.name)
    expect(names).toContain('Arto Hellas')
    expect(names).toContain('Ada Lovelace')
  })

  test('a specific person can be viewed', async () => {
    const personsAtStart = await api.get('/api/persons')
    const personToView = personsAtStart.body[0]

    const result = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual(personToView)
    expect(result.body.name).toBe(personToView.name)
    expect(result.body.number).toBe(personToView.number)
  })

  test('a new person can be added successfully', async () => {
    const newPerson = {
      name: 'Mary Poppins',
      number: '09-12345678'
    }

    const response = await api
      .post('/api/persons')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newPerson)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.name).toBe(newPerson.name)
    expect(response.body.number).toBe(newPerson.number)
    expect(response.body.id).toBeDefined()

    const personsAfter = await api.get('/api/persons')
    expect(personsAfter.body).toHaveLength(3)
    const names = personsAfter.body.map((p) => p.name)
    expect(names).toContain('Mary Poppins')
  })

  test('a person without a name cannot be added (400 Bad Request)', async () => {
    const personWithoutName = {
      number: '09-12345678'
    }

    const response = await api
      .post('/api/persons')
      .set('Authorization', `Bearer ${authToken}`)
      .send(personWithoutName)
      .expect(400)

    expect(response.body.error).toBeDefined()

    const personsAfter = await api.get('/api/persons')
    expect(personsAfter.body).toHaveLength(2)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
