# enforce operation `tags` are present in root level `tags` (tags-ref)

Validates that any operation `tags` are present in root level `tags`.

## Examples of *correct* usage

```json
{
  "tags": [
    {
      "name": "pet"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        "tags": ["pet"]
      }
    }
  }
}
```

## Examples of **incorrect** usage

```json
{
  "tags": [
    {
      "name": "alligator"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        "tags": ["pet"]
      }
    }
  }
}
```
