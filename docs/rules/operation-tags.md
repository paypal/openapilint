# enforce existence and non-empty operation tags (operation-tags)

Validates that all operations have a non-empty `tags` array.

## Examples of *correct* usage

```json
{
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
  "paths": {
    "/pets": {
      "get": {
        "tags": []
      }
    }
  }
}
```

```json
{
  "paths": {
    "/pets": {
      "get": {
      }
    }
  }
}
```
