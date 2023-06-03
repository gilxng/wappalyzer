const { spawn } = require('node:child_process')
const express = require('express')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())

app.get('/', (req, res) => {
  const URL = req.query.url
  if (!URL) return res.status(400).send('URL is required')

  const ls = spawn('node', ['./src/drivers/npm/cli.js', URL])

  let result = '{}'

  ls.stdout.on('data', (data) => {
    result = data.toString()
    res.json(JSON.parse(result))
  })

  ls.stderr.on('data', (data) => {
    res.status(500).send(data.toString())
  })

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
})

app.listen(PORT)
