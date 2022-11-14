import express from 'express'

import upcycle from './routes/upcycle.js'

const app = express()
const port = 3000

app.use('/upcycle', upcycle)

app.listen(port, () => {
  console.log(`vat-api: listening on port ${port}`)
})
