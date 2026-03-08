const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Hata: Şifreyi girmelisiniz! Örnek: node mongo.js sifre123')
  process.exit(1)
}

const password = process.argv[2]

// ÖNEMLİ: Aşağıdaki URL'de <password> yazan yere şifreni YAZMA. 
// Kod bunu otomatik olarak yukarıdaki password değişkeninden alacak.
// Sadece cluster adresinin (cluster0.xxxx.mongodb.net) doğruluğundan emin ol.
const url = `mongodb+srv://omer:${password}@cluster0.xxxx.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Sadece şifre girilirse (node mongo.js sifre) listele
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  // Şifre, isim ve numara girilirse (node mongo.js sifre "isim" "numara") ekle
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}