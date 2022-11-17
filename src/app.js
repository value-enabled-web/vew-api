import express from 'express'

import upcycle from './routes/upcycle.js'

const app = express()
const port = 3000

app.use('/upcycle', upcycle)

app.get('/', (req, res) => {
  const html = `
    <strong>AVAILABLE ROUTES</strong>

    <ul>
      <li>GET
        <ul>
          <li>
            /upcycle?url=&lt;url&gt;
          </li>
        </ul>
      </li>
    </ul>
    `
  res.set('Content-Type', 'text/html')
  res.send(html)
})

app.listen(port, () => {
  console.log(`vat-api: listening on port ${port}`)
})
