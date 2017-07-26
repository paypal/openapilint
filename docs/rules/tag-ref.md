# enforce operation `tags` are present in root level `tags` (docs-path)

Validates that any operation `tags` are present in root level `tags`

## Examples of *correct* usage

```
{
  "tags": [
    {
      "name": "pet"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        tags: ["pet"]
        ...
      }
    }
  }
}
```

## Examples of **incorrect** usage

```
{
  "tags": [
    {
      "name": "alligator"
    }
  ],
  "paths": {
    "/pets": {
      "get": {
        tags: ["pet"]
        ...
      }
    }
  }
}
```
