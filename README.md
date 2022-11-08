# 👨‍🔬 vat-api

Experimental APIs for [Value Added Text](https://github.com/seetee-io/value-enabled-text).

## Run APIs

- `npm install`; then

- `npm run dev` to run with hot reloading; or
- `npm start` to run without hot reloading

The APIs will be served on port 3000.

## Available APIs

### `GET /upcycle?url=<url>`

Fetches and parses an article into readable VAT format.

**Returns**

For a successful query, a JSON object like this:

```json
{
  "id": "<...>", // normalized article url,
  "content": "<...>" // readable article markdown,
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
