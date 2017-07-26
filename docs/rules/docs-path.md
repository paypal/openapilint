# enforce existence and well formed `x-docsPath` (docs-path)

Validates that the `info.x-docPath` is present, and well formed.  `x-docPath` MUST only contain alpha characters for use when creating developer documentation using a docs engine.

## Examples of *correct* usage

```
{
  "info": {
    "x-docPath": "myApiPath"
  }
}
```

## Examples of **incorrect** usage

```
{
  "info": {
    "x-docPath": "my invalid #path"
  }
}
```

```
{
  "info": {
  }
}
```