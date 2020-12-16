const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://KIM:kim@ksj.pnysk.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected OK!!'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('KST TEST => Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})