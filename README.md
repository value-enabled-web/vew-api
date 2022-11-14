# 👨‍🔬 vat-api

An experimental API for [Value-Added Text](https://github.com/seetee-io/value-enabled-text).

## How to Run

You need a [somewhat recent version of Node.js](https://nodejs.org/en/download) to run this.

- `npm install`; then

- `npm run dev` to run with hot reloading; or
- `npm start` to run without hot reloading

The APIs will be served on port 3000.

## API

### `GET /upcycle?url=<url>`

Fetches and parses an article into readable VAT format.

**Returns**

For a successful query, a JSON object like this:

```json
{
  "id": "<...>", // normalized article url,
  "content": "<...>" // readable article markdown,
  "paymentInfo": {
    "type": "<...>", // e.g. "lnAddress"
    "value": "<...>"
  }
  "_data": { // non standardized data
    "title": "<...>", // article title
    "html": "<...>", // cleaned article html
  }
}
```

If an error occurs, a JSON object like this:

```json
{
  "error": "<...>" // description of the error
}
```
