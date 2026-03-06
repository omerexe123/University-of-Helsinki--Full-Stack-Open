require('dotenv').config() // .env kullanabilmek için şart
const express = require('express')
const morgan = require('morgan')
const cors = require('cors') // SADECE BİR KEZ YAZILMALI
const Person = require('./models/person')

const app = express()

// Middleware'ler
app.use(cors()) // SADECE BİR KEZ
app.use(express.static('dist'))
app.use(express.json())

// Morgan Log Ayarı
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// 1. Ana Sayfa
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// 2. Tüm Listeyi Göster (MongoDB'den çekiyoruz)
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// 3. Bilgi Sayfası (Dinamik sayı MongoDB'den)
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    `)
  })
})

// 4. Tek Bir Kişiyi Göster
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

// 5. Kişi Sil
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
// 6. Yeni Kişi Ekle (MongoDB'ye kaydet)
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})