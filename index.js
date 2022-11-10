import express from 'express'
import normalizeUrl from 'normalize-url'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'
import { Readability, isProbablyReaderable } from '@mozilla/readability'
import TurndownService from 'turndown'

import { matchLightningAddress } from './utils.js'

const app = express()
const port = 3000

const urlValidator = (req, res, next) => {
  if (!req.query.url) {
    res.status(400).json({ error: 'missing url query parameter' })
  }

  try {
    const url = new URL(req.query.url)

    switch (url.protocol) {
      case 'http:':
      case 'https:':
        next()
        break
      default:
        res.status(400).json({ error: 'not a http or https url' })
    }
  } catch {
    res.status(400).json({ error: 'invalid url' })
  }
}

app.get('/upcycle', urlValidator, async (req, res, next) => {
  try {
    const url = normalizeUrl(req.query.url)

    const response = await fetch(req.query.url)
    const rawHtml = await response.text()

    const lnAddress = matchLightningAddress(rawHtml)

    const window = new JSDOM('').window
    const purify = DOMPurify(window)
    const cleanHtml = purify.sanitize(rawHtml, { WHOLE_DOCUMENT: true })

    const dom = new JSDOM(cleanHtml, { url })

    if (!isProbablyReaderable(dom.window.document)) {
      res.status(400).json({ error: 'not a readable document' })
    }

    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(article.content)

    const json = {
      id: url,
      content: markdown,
      _data: {
        title: article.title,
        html: article.content,
      },
    }

    if (lnAddress) {
      json.paymentInfo = {
        type: 'lnaddress',
        value: lnAddress,
      }
    }

    res.json(json)
  } catch (err) {
    next(err)
  }
})

app.listen(port, () => {
  console.log(`vat-api: listening on port ${port}`)
})
