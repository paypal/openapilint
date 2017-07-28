# enforce existence and well formed `x-docsPath` (docs-path)

Validates that the `info.x-docPath` is present, and well formed.  `x-docPath` MUST only contain alpha characters for use when creating developer documentation using a docs engine.

## Examples of *correct* usage

```json
{
  "info": {
    "x-docPath": "myApiPath"
  }
}
```

## Examples of **incorrect** usage

```json
{
  "info": {
    "x-docPath": "my invalid #path"
  }
}
```

```json
{
  "info": {
  }
}
```