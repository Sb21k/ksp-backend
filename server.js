const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = 3000
const db = require('./config/db')


app.use(cors()); 
app.use(express.json())

app.get('/', (req, res) => res.send('backend started'))
app.listen(port, () => console.log(`backend app listening on port ${port}!`))