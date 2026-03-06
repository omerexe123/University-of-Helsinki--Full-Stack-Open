const express = require('express')
const morgan = require('morgan') // Morgan'ı dahil et
const app = express()
const cors = require('cors')
app.use(cors())
const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

// Alıştırma 3.8: Morgan için özel bir "token" oluşturuyoruz
morgan.token('body', (req) => JSON.stringify(req.body))

// Morgan'ı yapılandır: metod, url, durum kodu, yanıt süresi ve gönderilen veri
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())

let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 1. Ana Sayfa (Test amaçlı)
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

// 2. Tüm Listeyi Göster (Alıştırma 3.1)
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3. Bilgi Sayfası (Alıştırma 3.2)
app.get('/info', (request, response) => {
  const count = persons.length
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `)
})

// 4. Tek Bir Kişiyi Göster (Alıştırma 3.3)
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) // URL'deki id'yi sayıya çevir
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end() // Kişi yoksa 404 dön
  }
})

// 5. Kişi Sil (Alıştırma 3.4)
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  
  response.status(204).end() // Başarılı silme sonrası içerik yok mesajı
})
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    // Alıştırma 3.6: Hata Kontrolleri
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
  
    // İsim zaten varsa ekleme yapma
    const nameExists = persons.some(p => p.name === body.name)
    if (nameExists) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    // Yeni kişi nesnesi oluştur
    const person = {
      id: Math.floor(Math.random() * 1000000), // Şimdilik rastgele ID
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
    response.json(person)
  })
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })