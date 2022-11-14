import express from 'express'

import { Readability, isProbablyReaderable } from '@mozilla/readability'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import normalizeUrl from 'normalize-url'
import TurndownService from 'turndown'

const router = express.Router()

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

// Same matching as Alby:
// https://github.com/getAlby/lightning-browser-extension/blob/master/src/extension/content-script/batteries/helpers.ts
const matchLightningAddress = text => {
  // The second lightning emoji is succeeded by an invisible variation
  // selector-16 character: https://emojipedia.org/variation-selector-16/️
  const regex = /((⚡|⚡️):?|lightning:|lnurl:)\s?([\w.-]+@[\w.-]+[.][\w.-]+)/i
  const match = text.match(regex)
  if (match) return match[3]

  return null
}

router.get('/', urlValidator, async (req, res, next) => {
  try {
    const url = normalizeUrl(req.query.url)

    const fetchResponse = await fetch(req.query.url)
    const rawHtml = await fetchResponse.text()

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

    const response = {
      id: url,
      content: markdown,
      _data: {
        title: article.title.split('|')[0],
        hostname: new URL(url).hostname,
        html: article.content,
      },
    }

    if (lnAddress) {
      response.paymentInfo = {
        type: 'lnaddress',
        value: lnAddress,
      }
    }

    res.json(response)
  } catch (err) {
    next(err)
  }
})

export default router
