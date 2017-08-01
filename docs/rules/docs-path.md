# enforce present and well formed `x-publicDocsPath` (docs-path)

Validates that the `info.x-publicDocsPath` is present, and well formed.  `x-publicDocsPath` MUST only contain alpha characters for use when creating developer documentation using a docs engine.

## Examples of *correct* usage

```json
{
  "info": {
    "x-publicDocsPath": "myApiPath"
  }
}
```

## Examples of **incorrect** usage

```json
{
  "info": {
    "x-publicDocsPath": "my invalid #path"
  }
}
```

```json
{
  "info": {
  }
}
```