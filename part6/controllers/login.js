const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const config = require('../utils/config')

router.post('/', async (request, response, next) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id.toString()
  }

  const token = jwt.sign(userForToken, config.JWT_SECRET)

  response.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router
