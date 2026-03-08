const express = require('express')
const router = express.Router()
const Person = require('../models/person')
const middleware = require('../utils/middleware')

router.get('/', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

router.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

router.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

router.post('/', middleware.tokenExtractor, middleware.userExtractor, (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
    user: request.user.id
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

router.put('/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

module.exports = router
