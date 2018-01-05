# (DEPRECATED) enforce present and well formed `x-publicDocsPath` (docs-path)

*Note: this rule is deprecated, and will be removed in the next release. It can be replaced by using `info-custom`.*

Validates that the `info.x-publicDocsPath` is present, and well formed.  `x-publicDocsPath` MUST only contain alpha characters for use when creating developer documentation using a docs engine.

## Examples of *correct* usage

```json
{
  "info": {
    "x-publicDocsPath": "myApiPath-includes-dashes"
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
