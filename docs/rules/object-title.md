# requires a title for any type that is an object

Validates that a title exists for any defined type which is an `object`.

## Examples of *correct* usage

```json
{
  "type": "object",
  "title": "Person",
  "properties": {
    "id": {
      "type": "string"
    },
    "address": {
      "type": "object",
      "title": "Address",
      "properties": {
        "id": {
          "type": "string"
        }
      }
    }
  }
}
```

## Examples of *incorrect* usage

```json
{
  "type": "object",
  "properties": {
    "address": {
      "type": "object"
    }
  }
}
```
