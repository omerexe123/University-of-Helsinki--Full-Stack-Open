const app = require('./app')
const config = require('./utils/config')

app.listen(config.PORT, () => {
  const logger = require('./utils/logger')
  logger.info(`Server running on port ${config.PORT}`)
})
