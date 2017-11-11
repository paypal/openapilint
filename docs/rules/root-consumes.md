# enforce present and non-empty `consumes` array (root-consumes)

Validates that the `consumes` array is present and non-empty.

## Examples of *correct* usage

```json
{
  "consumes": [
    "application/json"
  ]
}
```

## Examples of **incorrect** usage

```json
{
  "consumes": []
}
```

```json
{
}
```
