const express = require('express')
const router = express.Router()
const keyValueController = require('./controllers/keyVauleController')

router.post('/api/object', keyValueController.createOrUpdate)

router.get('/api/object/:key', keyValueController.getByKey)

module.exports = router
