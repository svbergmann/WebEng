// core modules
const path = require('path')

// third party modules
const express = require('express')

const app = express()

app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(3000, () => console.log('Student app listening on port 3000!'))